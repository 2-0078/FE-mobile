"use server";

export const test = async () => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/board-service/api/v1/board`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log(response.json());
  return response;
};

export const signup = async (data: any) => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/auth-service/api/v1/signup`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  console.log(response);
  console.log(data);
  return response;
};
