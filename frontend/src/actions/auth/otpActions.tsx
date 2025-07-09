import { redirect } from "next/navigation";

export async function otpSubmit(userOtp: string) {

  // testing pending state
  await new Promise((resolve) => setTimeout(resolve, 2000))
  //logic of cheacking otp
  if (userOtp === "1234") { // Example static OTP for testing
    redirect("/")
  } else {
    return { error: "Invalid OTP" };
  }
}
