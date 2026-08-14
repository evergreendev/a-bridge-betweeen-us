import type { Form, FormSubmission } from '@/payload-types'
import type { Payload, PayloadRequest } from 'payload'

type SubmissionValue = { field: string; value: unknown }
// Rich-text nodes are intentionally dynamic because forms may contain legacy editor data.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LexicalNode = Record<string, any>

const table = (values: SubmissionValue[]) =>
  `<table>${values
    .map(({ field, value }) => `<tr><td>${field}</td><td>${String(value ?? '')}</td></tr>`)
    .join('')}</table>`

export const replaceFormVariables = (
  value: null | string | undefined,
  values: SubmissionValue[],
): string =>
  (value || '').replace(/\{\{(.+?)\}\}/g, (_match, variable: string) => {
    if (variable === '*') {
      return values.map(({ field, value }) => `${field} : ${String(value ?? '')}`).join(' <br /> ')
    }
    if (variable === '*:table') return table(values)
    const match = values.find(({ field }) => field === variable)
    return match ? String(match.value ?? '') : variable
  })

const renderNodes = async (nodes: LexicalNode[], values: SubmissionValue[]): Promise<string> =>
  (await Promise.all((nodes || []).map((node) => renderNode(node, values)))).join('')

const renderNode = async (node: LexicalNode, values: SubmissionValue[]): Promise<string> => {
  const children = () => renderNodes(node.children || [], values)

  switch (node.type) {
    case 'paragraph':
      return `<p>${await children()}</p>`
    case 'heading': {
      const style = [
        node.format ? `text-align: ${node.format};` : '',
        node.indent > 0 ? `padding-inline-start: ${node.indent * 40}px;` : '',
      ]
        .filter(Boolean)
        .join(' ')
      return `<${node.tag}${style ? ` style='${style}'` : ''}>${await children()}</${node.tag}>`
    }
    case 'quote': {
      const style = [
        node.format ? `text-align: ${node.format};` : '',
        node.indent > 0 ? `padding-inline-start: ${node.indent * 40}px;` : '',
      ]
        .filter(Boolean)
        .join(' ')
      return `<blockquote${style ? ` style='${style}'` : ''}>${await children()}</blockquote>`
    }
    case 'link': {
      const href = replaceFormVariables(
        node.fields?.linkType === 'custom' ? node.fields?.url : node.fields?.doc?.value?.id,
        values,
      )
      return `<a href="${href}"${node.fields?.newTab ? ' rel="noopener noreferrer" target="_blank"' : ''}>${await children()}</a>`
    }
    case 'list':
      return `<${node.tag} class="${node.listType}">${await children()}</${node.tag}>`
    case 'listitem':
      return `<li value=${node.value}>${await children()}</li>`
    case 'linebreak':
      return '<br>'
    case 'tab':
      return '\t'
    case 'text': {
      let text = replaceFormVariables(node.text || '', values)
      if (node.format & 1) text = `<strong>${text}</strong>`
      if (node.format & 2) text = `<em>${text}</em>`
      if (node.format & 4) text = `<span style="text-decoration: line-through">${text}</span>`
      if (node.format & 8) text = `<span style="text-decoration: underline">${text}</span>`
      if (node.format & 16) text = `<code>${text}</code>`
      if (node.format & 32) text = `<sub>${text}</sub>`
      if (node.format & 64) text = `<sup>${text}</sup>`
      return text
    }
    default:
      return node.children ? children() : '<span>unknown node</span>'
  }
}

const renderMessage = async (message: unknown, values: SubmissionValue[]) => {
  if (message && typeof message === 'object' && 'root' in message) {
    const root = (message as { root?: { children?: LexicalNode[] } }).root
    if (root?.children) return renderNodes(root.children, values)
  }

  // Kept for old forms that were created with the former Slate editor.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSlate = (nodes: any[]): string =>
    nodes
      .map((node) => {
        if (node.text !== undefined) return replaceFormVariables(String(node.text), values)
        return `<p>${renderSlate(node.children || [])}</p>`
      })
      .join('')
  return renderSlate(Array.isArray(message) ? message : [])
}

export async function sendFormSubmissionEmails({
  payload,
  recipient,
  req,
  submission,
}: {
  payload: Payload
  recipient: string
  req: PayloadRequest
  submission: FormSubmission
}) {
  const form =
    typeof submission.form === 'object'
      ? submission.form
      : ((await payload.findByID({ collection: 'forms', id: submission.form, req })) as Form)
  const values: SubmissionValue[] = [
    ...(submission.submissionData || []),
    { field: 'formSubmissionID', value: submission.id },
  ]

  for (const email of form.emails || []) {
    await payload.sendEmail({
      bcc: email.bcc ? replaceFormVariables(email.bcc, values) : '',
      cc: email.cc ? replaceFormVariables(email.cc, values) : '',
      from: replaceFormVariables(email.emailFrom, values),
      html: `<div>${await renderMessage(email.message, values)}</div>`,
      replyTo: replaceFormVariables(email.replyTo || email.emailFrom, values),
      subject: replaceFormVariables(email.subject, values),
      to: recipient,
    })
  }

  return form.emails?.length || 0
}
