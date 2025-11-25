import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const TAX_RATE = 0.13;

const menuItems: MenuItem[] = [
  // Coffee
  { id: '1', name: 'Espresso', price: 2.50, category: 'Coffee' },
  { id: '2', name: 'Americano', price: 3.00, category: 'Coffee' },
  { id: '3', name: 'Cappuccino', price: 4.25, category: 'Coffee' },
  { id: '4', name: 'Latte', price: 4.50, category: 'Coffee' },
  { id: '5', name: 'Mocha', price: 5.00, category: 'Coffee' },
  { id: '6', name: 'Cold Brew', price: 4.00, category: 'Coffee' },
  
  // Pastries
  { id: '7', name: 'Croissant', price: 3.50, category: 'Pastries' },
  { id: '8', name: 'Blueberry Muffin', price: 3.25, category: 'Pastries' },
  { id: '9', name: 'Chocolate Chip Cookie', price: 2.75, category: 'Pastries' },
  { id: '10', name: 'Cinnamon Roll', price: 4.00, category: 'Pastries' },
  
  // Specialty Drinks
  { id: '11', name: 'Vanilla Frappuccino', price: 5.50, category: 'Specialty' },
  { id: '12', name: 'Caramel Macchiato', price: 5.25, category: 'Specialty' },
  { id: '13', name: 'Matcha Latte', price: 5.00, category: 'Specialty' },
  { id: '14', name: 'Chai Tea Latte', price: 4.75, category: 'Specialty' },
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <header className="bg-amber-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">☕</span>
            <div>
              <h1>Brew Haven Coffee Shop</h1>
              <p className="text-amber-200 text-sm mt-1">Tax Example Application (13% Tax Rate)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="mb-6">Menu</h2>
              
              {categories.map(category => (
                <div key={category} className="mb-8 last:mb-0">
                  <h3 className="text-amber-800 mb-4">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-amber-500 hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-gray-900">{item.name}</h4>
                            <span className="text-amber-700">${item.price.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <span>+</span>
                            Add to Order
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl">🛒</span>
                <h2>Order Summary</h2>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map(item => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start gap-2 pb-3 border-b border-gray-200 last:border-0"
                      >
                        <div className="flex-1">
                          <p className="text-gray-900">{item.name}</p>
                          <p className="text-gray-600 text-sm">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors px-2"
                            aria-label="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-300 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax ({(TAX_RATE * 100).toFixed(0)}%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-amber-900 pt-2 border-t border-gray-300">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg transition-colors">
                      Place Order
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-amber-900 text-sm">
                      <strong>Tax Calculation Example:</strong>
                    </p>
                    <p className="text-gray-700 text-sm mt-2">
                      Tax = Subtotal × {(TAX_RATE * 100).toFixed(0)}%
                    </p>
                    <p className="text-gray-700 text-sm">
                      ${subtotal.toFixed(2)} × 0.13 = ${tax.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
