// Easy pairs are familiar and distinct; tricky pairs reward more careful clues.
const groups = {
  Places: {
    Easy: [['Airport','Train station'],['Beach','Swimming pool'],['Hospital','Pharmacy'],['School','College'],['Cinema','Theatre'],['Restaurant','Food truck'],['Library','Bookshop'],['Zoo','Safari'],['Gym','Yoga class'],['Supermarket','Local market']],
    Tricky: [['Museum','Art gallery'],['Hotel','Hostel'],['Castle','Palace'],['Balcony','Terrace'],['Park','Garden'],['Bakery','Cafe'],['Desert','Sand dune'],['Island','Peninsula']],
  },
  Food: {
    Easy: [['Pizza','Burger'],['Biryani','Pulao'],['Ice cream','Kulfi'],['Tea','Coffee'],['Pasta','Noodles'],['Cake','Cookies'],['Popcorn','Chips'],['Mango','Peach'],['Chocolate','Caramel'],['Soup','Salad']],
    Tricky: [['Pancake','Waffle'],['Jam','Marmalade'],['Lemon','Lime'],['Butter','Margarine'],['Yogurt','Custard'],['Cappuccino','Latte'],['Dumpling','Ravioli'],['Honey','Syrup']],
  },
  'Everyday life': {
    Easy: [['Train','Bus'],['Doctor','Nurse'],['Police officer','Security guard'],['Teacher','Principal'],['Chef','Waiter'],['Mobile phone','Tablet'],['Laptop','Desktop computer'],['Umbrella','Raincoat'],['Bicycle','Scooter'],['Clock','Calendar']],
    Tricky: [['Notebook','Diary'],['Backpack','Suitcase'],['Headphones','Earbuds'],['Elevator','Escalator'],['Mirror','Window'],['Candle','Lantern'],['Sofa','Armchair'],['Key','Password']],
  },
  'Nature & animals': {
    Easy: [['Elephant','Rhino'],['Monsoon','Winter'],['Cat','Dog'],['Lion','Tiger'],['River','Lake'],['Mountain','Hill'],['Moon','Sun'],['Butterfly','Bee'],['Snow','Rain'],['Forest','Jungle']],
    Tricky: [['Crocodile','Alligator'],['Turtle','Tortoise'],['Frog','Toad'],['Dolphin','Whale'],['Mist','Cloud'],['Stream','Creek'],['Thunder','Lightning'],['Sunrise','Sunset']],
  },
  'Fun & celebrations': {
    Easy: [['Cricket','Baseball'],['Football','Rugby'],['Birthday party','Wedding'],['Diwali','Holi'],['Space station','Airplane'],['Camping','Picnic'],['Chess','Checkers'],['Swimming','Surfing'],['Guitar','Piano'],['Dancing','Singing']],
    Tricky: [['Tennis','Badminton'],['Marathon','Sprint'],['Concert','Festival'],['Magic trick','Illusion'],['Bowling','Skittles'],['Painting','Drawing'],['Ballet','Gymnastics'],['Karaoke','Open mic']],
  },
}
export const WORD_PAIRS = Object.entries(groups).flatMap(([category, levels]) =>
  Object.entries(levels).flatMap(([difficulty, pairs]) =>
    pairs.map(([word, related]) => ({ word, related, category, difficulty }))))
