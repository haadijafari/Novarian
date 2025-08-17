import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

export async function otpSubmit(userOtp: string) {

  // testing pending state
  await new Promise((resolve) => setTimeout(resolve, 2000))
  //logic of cheacking otp
  if (userOtp === "1234") { // Example static OTP for testing
    redirect(ROUTES.HOME.path())
  } else {
    return { error: "Invalid OTP" };
  }
}
