<template>
    <div class="content">
      <h2>Manager Product</h2>
      <button class="add-button" @click="openAddForm">Add New Product</button>
  
      <!-- Bảng sản phẩm -->
      <div class="table-container">
        <table class="product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product.id">
              <td>{{ index + 1 }}</td>
              <td>
                <img :src="product.image" alt="product.name" class="product-image" />
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.price }} đ</td>
              <td>{{ product.quantity }}</td>
              <td>
                <button class="edit-button" @click="openEditForm(product)">Edit</button>
                <button class="delete-button" @click="confirmDelete(product)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Form thêm/chỉnh sửa sản phẩm hiển thị trong modal -->
      <div v-if="showForm" class="modal">
        <div class="modal-content">
          <h3>{{ editMode ? 'Edit Product' : 'Add New Product' }}</h3>
          <form class="product-form" @submit.prevent="editMode ? saveProduct() : addProduct()">
            <div class="form-group">
              <label for="name">Name</label>
              <input v-model="newProduct.name" id="name" placeholder="Enter product name" required />
            </div>
            <div class="form-group">
              <label for="image">Image</label>
              <input v-model="newProduct.image" id="image" placeholder="Enter image URL" required />
            </div>
            <div class="form-group">
              <label for="price">Price</label>
              <input v-model.number="newProduct.price" id="price" placeholder="Enter price" required />
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input v-model.number="newProduct.quantity" id="quantity" placeholder="Enter quantity" required />
            </div>
            <div class="form-buttons">
              <button type="button" class="cancel-button" @click="closeForm">Close</button>
              <button type="submit" class="add-button">{{ editMode ? 'Save' : 'Add' }}</button>
            </div>
          </form>
        </div>
      </div>
  
      <div v-if="showDeleteConfirm" class="modal">
        <div class="modal-content">
          <h3>Xác nhận xóa!</h3>
          <p>Bạn có chắc chắn muốn xóa sản phẩm {{ productToDelete?.name }}?</p>
          <div class="form-buttons">
            <button type="button" class="cancel-button" @click="cancelDelete">Cancel</button>
            <button type="button" class="delete-button" @click="deleteProductConfirmed">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const defaultProducts = [
    { id: 1, name: 'Orange', image: 'https://www.kesargrocery.com/images/P/orange-04.jpg', price: 30000, quantity: 100 },
    { id: 2, name: 'Apple', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/330px-Red_Apple.jpg', price: 20000, quantity: 50 },
    { id: 3, name: 'Banana', image: 'https://target.scene7.com/is/image/Target/GUEST_cf4773e6-afec-4aa1-89e7-74b7dfc09973?wid=1200&hei=1200&qlt=80&fmt=webp', price: 25000, quantity: 200 },
    { id: 4, name: 'Grape', image: 'https://darkrockbrewing.co.uk/wp-content/uploads/2023/12/grape-red-768x768.png', price: 60000, quantity: 80 },
    { id: 5, name: 'Watermelon', image: 'https://organicmandya.com/cdn/shop/files/Watermelon.jpg?v=1721378496&width=1000', price: 30000, quantity: 30 },
  ]
  
  const products = ref([])
  
  // Khởi tạo sản phẩm từ localStorage
  onMounted(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products'))
    if (storedProducts && storedProducts.length > 0) {
      products.value = storedProducts
    } else {
      products.value = defaultProducts
    }
  })
  
  const showForm = ref(false)
  const editMode = ref(false)
  const currentEditId = ref(null)
  const showDeleteConfirm = ref(false) // Biến điều khiển modal xác nhận xóa
  const productToDelete = ref(null) // Sản phẩm đang chờ xóa
  
  const newProduct = ref({
    name: '',
    image: '',
    price: 0,
    quantity: 0
  })
  
  // Mở form thêm sản phẩm
  const openAddForm = () => {
    resetForm()
    editMode.value = false
    showForm.value = true
  }
  
  // Mở form chỉnh sửa sản phẩm
  const openEditForm = (product) => {
    newProduct.value = { ...product }
    currentEditId.value = product.id
    editMode.value = true
    showForm.value = true
  }
  
  // Đóng form
  const closeForm = () => {
    showForm.value = false
  }
  
  // Thêm sản phẩm mới
  const addProduct = () => {
    if (!validateProduct()) return
  
    const newId = products.value.length + 1
    const productToAdd = { ...newProduct.value, id: newId }
    products.value.push(productToAdd)
  
    updateLocalStorage()
    closeForm()
    resetForm()
  }
  
  const saveProduct = () => {
    if (!validateProduct()) return
  
    const index = products.value.findIndex(product => product.id === currentEditId.value)
    if (index !== -1) {
      products.value[index] = { ...newProduct.value, id: currentEditId.value }
      updateLocalStorage()
      closeForm()
      resetForm()
    }
  }
  
  const confirmDelete = (product) => {
    productToDelete.value = product
    showDeleteConfirm.value = true
  }
  
  const deleteProductConfirmed = () => {
    products.value = products.value.filter(product => product.id !== productToDelete.value.id)
    updateLocalStorage()
    cancelDelete() 
  }
  
  const cancelDelete = () => {
    showDeleteConfirm.value = false
    productToDelete.value = null
  }
  
  const validateProduct = () => {
    if (!newProduct.value.name || !newProduct.value.image) {
      alert('Tên và ảnh không được để trống!')
      return false
    }
  
    const existingProduct = products.value.find(
      product => product.name === newProduct.value.name && product.id !== currentEditId.value
    )
    if (existingProduct) {
      alert('Tên không hợp lệ!')
      return false
    }
  
    if (newProduct.value.price < 10000) {
      alert('Sản phẩm giá phải cao hơn 10000!')
      return false
    }
  
    if (newProduct.value.quantity < 1 || newProduct.value.quantity > 100) {
      alert('Số lượng sản phẩm không được dưới 1 và trên 100!')
      return false
    }
  
    return true
  }
  
  // Reset form về trạng thái mặc định
  const resetForm = () => {
    newProduct.value = {
      name: '',
      image: '',
      price: 0,
      quantity: 0
    }
    currentEditId.value = null
  }
  
  // Cập nhật localStorage
  const updateLocalStorage = () => {
    localStorage.setItem('products', JSON.stringify(products.value))
  }
  </script>
  
  <style scoped>
  .content {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  
  .add-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  .add-button:hover {
    background-color: #0056b3;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    color: black;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .product-form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .product-form input {
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .form-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .cancel-button {
    background-color: #6c757d;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    
  }
  
  .cancel-button:hover {
    background-color: #5a6268;
  }
  
  .delete-button {
    background-color: #dc3545;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .delete-button:hover {
    background-color: #c82333;
  }
  
  .table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .product-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    color: black;
  }
  
  .product-table th, .product-table td {
    padding: 15px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  .product-table th {
    background-color: #007bff;
    color: white;
  }
  
  .product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
  }
  
  .edit-button, .delete-button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .edit-button {
    background-color: #ffc107;
    color: black;
  }
  
  .edit-button:hover {
    background-color: #e0a800;
  }
  </style>
  