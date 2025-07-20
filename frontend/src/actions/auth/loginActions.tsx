'use server'

// import { redirect } from 'next/navigation'
import { z } from 'zod'

// Define separate branches for email and phone validation
const emailBranch = z
  .string()
  .trim()
  .email()
  .transform(val => ({ type: 'email' as const, value: val }))

const phoneBranch = z
  .string()
  .trim()
  .regex(/^\d{10,15}$/)
  .transform(val => ({ type: 'phone' as const, value: val }))

// Union schema to accept either email or phone
const loginSchema = z.union([emailBranch, phoneBranch])

type FormState = { error: string }

export async function loginSubmit(
  formData: FormData
): Promise<FormState> {
  // Extract and normalize input
  const raw = formData.get('numberOrGmail')
  const input = typeof raw === 'string' ? raw : ''

  // Validate against union schema
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    // Return error message
    return { error: parsed.error.issues[0].message }
  }

  const { type, value } = parsed.data

  try {
    if (type === 'email') {
      await handleEmailLogin(value)
    } else {
      await handlePhoneLogin(value)
    }
  } catch (err) {
    // TODO: check `err` for more detailed messaging/logging
    return { error: err as string }
  }

  // redirect on success
  const params = new URLSearchParams()
  params.append("state", "otp")

  if (type === "phone") params.append("phone", value)
  else params.append("email", value)

  // testing pending state
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { error: "" }
}

// Placeholder functions for auth logic
async function handleEmailLogin(email: string) {
  console.log(email)
  // e.g. check credentials
}

async function handlePhoneLogin(phone: string) {
  console.log(phone)
  // e.g. send OTP SMS or check SMS code
}
