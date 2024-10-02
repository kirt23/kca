import bcrypt from 'bcryptjs';

const data = { //_id removed 
    users: [
        {
            name: 'Basir',
            lastname: 'Burk',
            email: 'admin@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true
        },
        {
            name: 'John',
            lastname: 'McArthy',
            email: 'user@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: false,
        },
        {
            name: 'Ben',
            lastname: 'Dazel',
            email: 'admin1@email.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true
        },
        {
            name: 'Rick',
            lastname: 'Sanchez',
            email: 'user1@email.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: false
        }
    ],
    custom:[
       { 
        name: "John",
        lastname: "McArthy",
        image: "/images/blueMens.png",
        images: ["/images/yellowMens.png", "/images/blueMens.png",],
        phoneNum: "09436457821",
        description: "hiujpink sadasda asdasdasdadas",}
    ],
    products: [
        {
        name: "Blue Jersey",
        slug: "blue-jersey-men",
        category: "Men's Jersey",
        image: "/images/blueMens.png",
        price: 120,
        countInStock: 50,
        brand: "Nike",
        rating: 3.2,
        numReviews: 9,
        description: "Breathable and lightweight jersey for active lifestyles.",
        isArchived: false
        },
        {
        name: "Yellow Jersey",
        slug: "yellow-jersey-men",
        category: "Men's Jersey",
        image: "/images/yellowMens.png",
        price: 320,
        countInStock: 50,
        brand: "Nike",
        rating: 3.2,
        numReviews: 9,
        description: "Breathable and lightweight jersey for active lifestyles.",
        isArchived: false
        },
        {
        name: "White Jersey",
        slug: "White-jersey-men",
        category: "Men's Jersey",
        image: "/images/whiteJersey.png",
        price: 620,
        countInStock: 50,
        brand: "Nike",
        rating: 4.2,
        numReviews: 9,
        description: "Breathable and lightweight jersey for active lifestyles.",
        isArchived: false
        },
        {
        name: "Gray Jersey",
        slug: "Gray-jersey-men",
        category: "Men's Jersey",
        image: "/images/grayJersey.png",
        price: 620,
        countInStock: 50,
        brand: "Nike",
        rating: 2.2,
        numReviews: 9,
        description: "Breathable and lightweight jersey for active lifestyles.",
        isArchived: false
        },
        {
        name: "Black Jersey",
        slug: "black-jersey-men",
        category: "Men's Jersey",
        image: "/images/blackJersey.png",
        price: 620,
        countInStock: 50,
        brand: "Nike",
        rating: 5,
        numReviews: 9,
        description: "Breathable and lightweight jersey for active lifestyles.",
        isArchived: false
        },
        {
        name: "Green Jersey",
        slug: "Green-jersey-men",
        category: "Men's Jersey",
        image: "/images/greenJersey.png",
        price: 520,
        countInStock: 50,
        brand: "Nike",
        rating: 4.2,
        numReviews: 9,
        description: "Breathable and lightweight jersey for active lifestyles.",
        isArchived: false
        },
        {
           
        name: "Kid's jersey Golden State",
        slug: "kids-jersey-golden-state-1",
        category: "Kid's Jersey",
        image: "/images/goldenstate.png",
        price: 120,
        countInStock: 50,
        brand: "Nike",
        rating: 4.5,
        numReviews: 10,
        description: "high quality shirt",
        isArchived: false
        },
        {
        name: "Kid's Jersey Jordan",
        slug: "kids-jordan-jersey",
        category: "Kid's Jersey",
        image: "/images/jordanjersey.png",
        price: 80,
        countInStock: 50,
        brand: "Adidas",
        rating: 4.3,
        numReviews: 8,
        description: "Iconic sneakers with a timeless design.",
        isArchived: false
        },
        {
        
        name: "Kid's Jersey Philippines",
        slug: "kids-jersey-philippines",
        category: "Men's Jersey",
        image: "/images/jerseyphilippines.png",
        price: 45,
        countInStock: 50,
        brand: "Under Armour",
        rating: 4.1,
        numReviews: 6,
        description: "Breathable and lightweight shorts for active lifestyles.",
        isArchived: false
        },
        {
        
        name: "Kid's Jersey Chicago Bulls",
        slug: "Kids-Jersey-Bulls-1",
        category: "Kid's Jersey",
        image: "/images/Kids-jersey-bulls-1.png",
        price: 28,
        countInStock: 50,
        brand: "Nike",
        rating: 4.1,
        numReviews: 6,
        description: "Breathable and lightweight shorts for active lifestyles.",
        isArchived: false
        },
    ],
};
export default data;
