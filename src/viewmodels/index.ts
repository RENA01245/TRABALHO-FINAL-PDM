export class UserViewModel {
    private user: any; // Replace 'any' with the actual user type

    constructor() {
        this.user = null; // Initialize user state
    }

    public setUser(user: any) {
        this.user = user; // Set user state
    }

    public getUser() {
        return this.user; // Get user state
    }

    // Additional methods to manage user state can be added here
}

export class ProductViewModel {
    private products: any[]; // Replace 'any' with the actual product type

    constructor() {
        this.products = []; // Initialize products state
    }

    public addProduct(product: any) {
        this.products.push(product); // Add product to state
    }

    public getProducts() {
        return this.products; // Get products state
    }

    // Additional methods to manage products state can be added here
}