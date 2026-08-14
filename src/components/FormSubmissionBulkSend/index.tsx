'use client'

import { Button, TextInput, toast, useConfig, useSelection } from '@payloadcms/ui'
import React, { useState } from 'react'
import './index.scss'

export const FormSubmissionBulkSend: React.FC = () => {
  const { count, getQueryParams } = useSelection()
  const {
    config: {
      routes: { api: apiRoute },
      serverURL,
    },
  } = useConfig()
  const [recipient, setRecipient] = useState('')
  const [sending, setSending] = useState(false)

  const send = async () => {
    if (!count) return toast.error('Select at least one submission.')
    setSending(true)
    try {
      const response = await fetch(`${serverURL}${apiRoute}/form-submissions/resend`, {
        body: JSON.stringify({ recipient, selectionQuery: getQueryParams() }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const result = await response.json()
      if (!response.ok && response.status !== 207)
        throw new Error(result.error || 'Unable to send submissions.')
      if (result.failures?.length) {
        toast.error(`Sent ${result.submissionsSent} submissions; ${result.failures.length} failed.`)
      } else {
        toast.success(
          `Sent ${result.submissionsSent} submission${result.submissionsSent === 1 ? '' : 's'} (${result.emailsSent} email${result.emailsSent === 1 ? '' : 's'}).`,
        )
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send submissions.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="form-submission-bulk-send">
      <TextInput
        label="Send selected submissions to"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRecipient(event.target.value)}
        path="bulk-send-recipient"
        placeholder="name@example.com"
        value={recipient}
      />
      <Button disabled={!count || !recipient || sending} onClick={send} size="small">
        {sending ? 'Sending…' : `Send selected${count ? ` (${count})` : ''}`}
      </Button>
    </div>
  )
}
