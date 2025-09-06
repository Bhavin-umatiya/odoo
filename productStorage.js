/**
 * Product Storage System
 * Handles product listings, categories, and filtering
 */

// Product storage object
const ProductStorage = {
    // Products array
    products: JSON.parse(localStorage.getItem('products')) || [],
    
    // Add a new product
    addProduct: function(productData) {
        // Validate required fields
        if (!productData.title || !productData.price || !productData.sellerId) {
            throw new Error('Missing required product information');
        }
        
        // Add unique ID and timestamps
        const product = {
            ...productData,
            id: Date.now(),
            dateAdded: new Date().toISOString(),
            dateModified: new Date().toISOString()
        };
        
        // Add to products array
        this.products.push(product);
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(this.products));
        
        return product;
    },
    
    // Get all products
    getAllProducts: function() {
        return this.products;
    },
    
    // Get product by ID
    getProductById: function(id) {
        return this.products.find(product => product.id.toString() === id.toString());
    },
    
    // Get products by seller ID
    getProductsBySeller: function(sellerId) {
        return this.products.filter(product => product.sellerId.toString() === sellerId.toString());
    },
    
    // Get products by category
    getProductsByCategory: function(category) {
        return this.products.filter(product => product.category === category);
    },
    
    // Get secondhand products
    getSecondhandProducts: function() {
        return this.products.filter(product => product.isSecondhand === true);
    },
    
    // Get featured products
    getFeaturedProducts: function(limit = 4) {
        return this.products
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, limit);
    },
    
    // Update product
    updateProduct: function(id, updatedData) {
        const index = this.products.findIndex(product => product.id.toString() === id.toString());
        
        if (index === -1) {
            throw new Error('Product not found');
        }
        
        // Preserve id, sellerId, and dateAdded
        const originalProduct = this.products[index];
        const updatedProduct = {
            ...originalProduct,
            ...updatedData,
            id: originalProduct.id,
            sellerId: originalProduct.sellerId,
            dateAdded: originalProduct.dateAdded,
            dateModified: new Date().toISOString()
        };
        
        // Update product in array
        this.products[index] = updatedProduct;
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(this.products));
        
        return updatedProduct;
    },
    
    // Delete product
    deleteProduct: function(id) {
        const index = this.products.findIndex(product => product.id.toString() === id.toString());
        
        if (index === -1) {
            throw new Error('Product not found');
        }
        
        // Remove product from array
        this.products.splice(index, 1);
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(this.products));
        
        return true;
    },
    
    // Search products
    searchProducts: function(query) {
        query = query.toLowerCase();
        return this.products.filter(product => 
            product.title.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            (product.brand && product.brand.toLowerCase().includes(query))
        );
    },
    
    // Filter products by price range
    filterByPrice: function(minPrice, maxPrice) {
        return this.products.filter(product => {
            const price = parseFloat(product.price);
            const min = minPrice !== undefined ? parseFloat(minPrice) : 0;
            const max = maxPrice !== undefined ? parseFloat(maxPrice) : Infinity;
            
            return price >= min && price <= max;
        });
    },
    
    // Filter products by condition
    filterByCondition: function(condition) {
        if (!condition) return this.products;
        return this.products.filter(product => product.condition === condition);
    }
};

// Export the ProductStorage object
window.ProductStorage = ProductStorage;
