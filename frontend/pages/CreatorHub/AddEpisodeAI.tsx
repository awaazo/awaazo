import { useCallback, useState } from "react";
import { FormControl, FormLabel, Button, Textarea, Select, Box, VStack, Image, Text, Input } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const PodcastGenres = ["Technology", "Comedy", "Science", "History", "News", "True Crime", "Business", "Health", "Education", "Travel", "Music", "Arts", "Sports", "Politics", "Fiction", "Food"];

const AddEpisodeAI= () => {
  const [episodeName, setEpisodeName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPodcast, setSelectedPodcast] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropAccepted(files, event) {
      console.log(files);
    },
  });
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <VStack spacing={5} align="center" p={5}>
          <Text fontSize="3xl">AI Generated Episode</Text>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={6} bg="gray.100" borderRadius="md">
            <Image
              src={"https://images.unsplash.com/photo-1495462911434-be47104d70fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"}
              alt="User Profile Picture"
              boxSize="100px"
              borderRadius="full"
            />
            <Text>@username</Text>
          </Box>
          <FormControl>
            <FormLabel>Episode Name</FormLabel>
            <Input value={episodeName} onChange={(e) => setEpisodeName(e.target.value)} placeholder="Enter episode name..." rounded={"full"} />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter podcast description..." />
          </FormControl>

          <FormControl>
            <FormLabel>Select Podcast</FormLabel>
            <Select placeholder="Select Podcast" value={selectedPodcast} onChange={(e) => setSelectedPodcast(e.target.value)}>
              {/* {Podcast.map((podcast) => (
            <option key={podcast} value={podcast}>{podcast}</option>
          ))} */}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Podcast Genre</FormLabel>
            <Select placeholder="Select genre" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              {PodcastGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </Select>
          </FormControl>

          <Box {...getRootProps()} border="2px dashed gray" borderRadius="md" p={4} textAlign="center" width="300px">
            <input {...getInputProps()} />
            {file ? <p>{file.name}</p> : <p>Drag & drop a document file here, or click to select one</p>}
          </Box>

          <Button
            colorScheme="blue"
            onClick={() => {
              /* handle generating AI */
            }}
          >
            Generate
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default AddEpisodeAI;
