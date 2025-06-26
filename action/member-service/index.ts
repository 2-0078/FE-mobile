"use server";

export async function getMemberProfile(memberUuid: string) {
  const response = await fetch(
    `${process.env.BASE_API_URL}/member-service/api/v1/profile-image?memberUuid=${memberUuid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data.result;
}
