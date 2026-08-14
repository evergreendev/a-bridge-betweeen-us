import { sendFormSubmissionEmails } from '@/utilities/sendFormSubmissionEmails'
import type { FormSubmission } from '@/payload-types'
import { parse } from 'qs-esm'
import type { Endpoint, Where } from 'payload'

const isEmail = (value: unknown): value is string =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const resendFormSubmissionsEndpoint: Endpoint = {
  path: '/resend',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await req.json?.()) as { recipient?: unknown; selectionQuery?: unknown }
    if (!isEmail(body?.recipient)) {
      return Response.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }
    if (typeof body?.selectionQuery !== 'string') {
      return Response.json({ error: 'Select at least one submission.' }, { status: 400 })
    }

    const query = parse(body.selectionQuery.replace(/^\?/, '')) as {
      where?: Record<string, unknown>
    }
    const result = await req.payload.find({
      collection: 'form-submissions',
      depth: 1,
      limit: 0,
      req,
      where: (query.where || { id: { in: [] } }) as Where,
    })

    if (!result.docs.length) {
      return Response.json({ error: 'Select at least one submission.' }, { status: 400 })
    }

    let emailsSent = 0
    const failures: Array<number | string> = []
    for (const submission of result.docs as FormSubmission[]) {
      try {
        emailsSent += await sendFormSubmissionEmails({
          payload: req.payload,
          recipient: body.recipient,
          req,
          submission,
        })
      } catch (error) {
        failures.push(submission.id)
        req.payload.logger.error({
          err: error,
          msg: `Could not resend form submission ${submission.id}.`,
        })
      }
    }

    const status = failures.length ? 207 : 200
    return Response.json(
      { emailsSent, failures, submissionsSent: result.docs.length - failures.length },
      { status },
    )
  },
}
