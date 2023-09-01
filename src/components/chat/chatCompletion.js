const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function createChatCompletionFn(prompt, exercise, article) {
  const tablefieldsExercise = ["name", "description", "difficultyLevel"];
  const tablefieldsArticle = ["title", "description"];

  const productsDataStringExercise = exercise
    .map((product, index) => {
      return `${product.name}, ${product.description}, ${product.difficultyLevel}, ${product.title}`;
    })
    .join("\n");

  const productsDataStringArticle = article
    .map((product, index) => {
      return `${product.title}, ${product.description}`;
    })
    .join("\n");

  const tableFieldsStringExercise = tablefieldsExercise.join(", ");
  const tableFieldsStringArticle = tablefieldsArticle.join(", ");

  const query = `${prompt},use this data \n\n ${tableFieldsStringExercise}\n${productsDataStringExercise} and please limit text to 25 words.`;

  const queryArticle = `${prompt},use this data \n\n ${tableFieldsStringArticle}\n${productsDataStringArticle}  and please limit text to 25 words.`;

  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "user",
        content: query,
      },
      {
        role: "user",
        content: queryArticle,
      },
    ],
  });

  return data?.choices[0]?.message?.content;
}
export async function createChatCompletionFnArticle(prompt, productsData) {
  const tablefields = ["title", "description"];

  const productsDataString = productsData
    .map((product) => `${product.name}, ${product.description}`)
    .join("\n");

  const tableFieldsString = tablefields.join(", ");

  const query = `${prompt},please limit the response text to 300 characters only. I have provided you the necessary information here:-, \n\n ${tableFieldsString}\n${productsDataString}.`;
  const { data } = await openai.createChatCompletion({
    // model: "gpt-3.5-turbo",
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "user",
        content: query,
      },
    ],
  });

  return data?.choices[0]?.message?.content;
}
