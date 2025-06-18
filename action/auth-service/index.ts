"use server";

export const signin = async (email: string, password: string) => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/auth-service/api/v1/login`,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const res = await response.json();
  console.log(res);
  return res;
};

export const signup = async (data: any) => {
  const year = data.birthdate.substring(0, 4);
  const month = data.birthdate.substring(4, 6);
  const day = data.birthdate.substring(6, 8);
  data.birthdate = `${year}-${month}-${day}T00:00:00.000Z`;

  const response = await fetch(
    `${process.env.BASE_API_URL}/auth-service/api/v1/signup`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const res = await response.json();
  return res;
};
