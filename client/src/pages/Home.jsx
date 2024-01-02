import React, { useState, useEffect } from "react";
import { Loader, Card, FormField } from "../components/index.js";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0)
    return data.map((post) => <Card key={post._id} {...post} />);
  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};
const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  //call to get all the posts
  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/post", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        //reverse to show the newest post at the top
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);
  //debouncing with settimeout to delay the execution of the search filter logic by 500 ms.the search will only be performed 500 milliseconds after the user stops typing, rather than on every keystroke
  // const handleSearchChange = (e) => {
  //   clearTimeout(searchTimeout);
  //   setSearchText(e.target.value);
  //   setSearchTimeout(
  //     setTimeout(() => {
  //       const searchResult = allPosts.filter(
  //         (item) =>
  //           item.name.toLowerCase().includes(searchText.toLowerCase()) ||
  //           item.prompt.toLowerCase().includes(searchText.toLowerCase())
  //       );
  //       setSearchedResults(searchResult);
  //     }, 500)
  //   );
  // };
  const handleSearchChange = (e) => {
    const currentInput = e.target.value;
    clearTimeout(searchTimeout);
    setSearchText(currentInput);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(currentInput.toLowerCase()) ||
            item.prompt.toLowerCase().includes(currentInput.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Explore a gallery of creative and visually captivating images created
          by the DALL-E AI.
        </p>
      </div>
      <div className="mt-16">
        <FormField
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search Posts"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for:
                <span className="text-[#222328]"> {searchText} </span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No search results found"
                />
              ) : (
                <RenderCards data={allPosts} title="No posts yet" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
