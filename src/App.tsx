import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
function App() {
  const QueryClient = useQueryClient();
  const postData: any = {
    userId: 661,
    id: 666,
    title: "I am popsam",
    body: "This is my body",
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response) throw new Error("Bad Response");
      return response.json();
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  }); //fetches data and converts to json

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (newPost) => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify(newPost),
        }
      );
      if (!response) throw new Error("Bad Response");
      return response.json();
    },
    onSuccess: (newPost) => {
      QueryClient.setQueryData(["posts"], (oldPosts: any) => [
        ...oldPosts,
        newPost,
      ]);
    },
  });

  if (isLoading) return <div>Data is loading</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      {isPending && <p>Data is being added</p>}
      <button onClick={() => mutate(postData)}>Add Post</button>
      {isSuccess && <p>Data has been added</p>}
      {data.map((todo: Todo) => (
        <div key={todo.id}>
          <p>{todo.id}</p>
          <p>{todo.title}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
