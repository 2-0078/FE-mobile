export const test = async () => {
  const response = await fetch(
    "http://13.125.94.196:8000/board-service/api/v1/board",
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
