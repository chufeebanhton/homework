class Product {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: number,
    public readonly icon: string,
  ) {}
}

class CartItem {
  constructor(
    public readonly product: Product,
    public quantity: number = 1,
  ) {}

  increase(): void {
    this.quantity += 1;
  }

  decrease(): void {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  getSubtotal(): number {
    return this.product.price * this.quantity;
  }
}

class ShoppingCart {
  private readonly items: CartItem[] = [];

  addProduct(product: Product): void {
    const existingItem = this.items.find(
      item => item.product.id === product.id,
    );

    if (existingItem) {
      existingItem.increase();
    } else {
      this.items.push(new CartItem(product));
    }
  }

  increaseItem(productId: number): void {
    this.findItem(productId)?.increase();
  }

  decreaseItem(productId: number): void {
    const item = this.findItem(productId);
    if (!item) return;

    item.decrease();
  }

  removeItem(productId: number): void {
    const index = this.items.findIndex(
      item => item.product.id === productId,
    );

    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  getItems(): readonly CartItem[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce(
      (total, item) => total + item.getSubtotal(),
      0,
    );
  }

  getItemCount(): number {
    return this.items.reduce(
      (count, item) => count + item.quantity,
      0,
    );
  }

  private findItem(productId: number): CartItem | undefined {
    return this.items.find(item => item.product.id === productId);
  }
}

class ProductCard {
  constructor(
    private readonly product: Product,
    private readonly cart: ShoppingCart,
    private readonly onCartChange: () => void,
  ) {}

  createElement(): HTMLElement {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image" aria-hidden="true">${this.product.icon}</div>
      <div class="product-info">
        <h2 class="product-name">${this.product.name}</h2>
        <p class="product-price">${formatCurrency(this.product.price)}</p>
        <button class="add-button" type="button">Add to Cart</button>
      </div>
    `;

    card.querySelector("button")?.addEventListener("click", () => {
      this.cart.addProduct(this.product);
      this.onCartChange();
    });

    return card;
  }
}

const products = [
  new Product(1, "Wireless Headphones", 79.99, "🎧"),
  new Product(2, "Smart Watch", 129.99, "⌚"),
  new Product(3, "Bluetooth Speaker", 49.99, "🔊"),
  new Product(4, "Mechanical Keyboard", 89.99, "⌨️"),
  new Product(5, "Phone Stand", 24.99, "📱"),
  new Product(6, "Portable Charger", 39.99, "🔋"),
];

const cart = new ShoppingCart();
const productGrid = document.getElementById("product-grid");
const cartItemsElement = document.getElementById("cart-items");
const cartCountElement = document.getElementById("cart-count");
const cartTotalElement = document.getElementById("cart-total");
const checkoutButton = document.getElementById(
  "checkout-button",
) as HTMLButtonElement;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function renderCart(): void {
  if (
    !cartItemsElement ||
    !cartCountElement ||
    !cartTotalElement
  ) {
    return;
  }

  cartCountElement.textContent = String(cart.getItemCount());
  cartTotalElement.textContent = formatCurrency(cart.getTotal());
  checkoutButton.disabled = cart.getItems().length === 0;

  if (cart.getItems().length === 0) {
    cartItemsElement.innerHTML =
      '<p class="empty-cart">Your cart is empty</p>';
    return;
  }

  cartItemsElement.innerHTML = cart
    .getItems()
    .map(
      item => `
        <div class="cart-item" data-product-id="${item.product.id}">
          <div>
            <div class="cart-item-name">${item.product.name}</div>
            <div class="cart-item-price">
              ${formatCurrency(item.getSubtotal())}
            </div>
          </div>
          <div class="quantity-controls">
            <button
              class="quantity-button"
              type="button"
              data-action="decrease"
              aria-label="Decrease ${item.product.name}"
            >−</button>
            <span class="quantity">${item.quantity}</span>
            <button
              class="quantity-button"
              type="button"
              data-action="increase"
              aria-label="Increase ${item.product.name}"
            >+</button>
          </div>
        </div>
      `,
    )
    .join("");

  cartItemsElement.querySelectorAll<HTMLButtonElement>(
    ".quantity-button",
  ).forEach(button => {
    button.addEventListener("click", () => {
      const itemElement =
        button.closest<HTMLElement>("[data-product-id]");
      const productId = Number(itemElement?.dataset.productId);

      if (button.dataset.action === "increase") {
        cart.increaseItem(productId);
      } else if (button.dataset.action === "decrease") {
        if (
          cart
            .getItems()
            .find(item => item.product.id === productId)?.quantity === 1
        ) {
          cart.removeItem(productId);
        } else {
          cart.decreaseItem(productId);
        }
      }

      renderCart();
    });
  });
}

products.forEach(product => {
  const card = new ProductCard(product, cart, renderCart);
  productGrid?.appendChild(card.createElement());
});

renderCart();
