export default {
  id: "food",
  title: "Food",

  levels: {
    beginner: [
      {
        id: "food-b-apple",
        word: "apple",
        translation: "りんご",
        example: "I eat an apple every morning.",
      },
      {
        id: "food-b-bread",
        word: "bread",
        translation: "パン",
        example: "She bought fresh bread.",
      },
      {
        id: "food-b-rice",
        word: "rice",
        translation: "ご飯",
        example: "Rice is a staple food in Japan.",
      },
      {
        id: "food-b-water",
        word: "water",
        translation: "水",
        example: "Drink more water.",
      },
      {
        id: "food-b-milk",
        word: "milk",
        translation: "牛乳",
        example: "He drinks milk before bed.",
      },
    ],

    intermediate: [
      {
        id: "food-i-recipe",
        word: "recipe",
        translation: "レシピ",
        example: "This recipe is very simple.",
        association: "cooking steps",
      },
      {
        id: "food-i-ingredient",
        word: "ingredient",
        translation: "材料",
        example: "Flour is the main ingredient.",
        association: "part of a dish",
      },
      {
        id: "food-i-spice",
        word: "spice",
        translation: "香辛料",
        example: "This dish needs more spice.",
        association: "strong flavor",
      },
    ],

    advanced: [
      {
        id: "food-a-cuisine",
        word: "cuisine",
        translation: "料理",
        example: "French cuisine is famous worldwide.",
        association: "a culture`s cooking style",
      },
      {
        id: "food-a-fermentation",
        word: "fermentation",
        translation: "発酵",
        example: "Fermentation is used to make miso.",
        association: "food transformed by microbes",
      },
    ],
  },
};
