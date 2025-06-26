"use server";

export async function getRepliesUuid(
  type: "FUNDING" | "PIECE",
  productUuid: string
) {
  console.log(productUuid);
  const response = await fetch(
    `${process.env.BASE_API_URL}/reply-service/api/v1/reply/list/${type}/asdasd`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
}
