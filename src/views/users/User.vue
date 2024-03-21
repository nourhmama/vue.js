<template>
  <div class="container">
    <h1 class="title">Users List</h1>
    <div class="user-count-box">
      <p class="user-count">
        Total number of users: <span>{{ users.length }}</span>
      </p>
    </div>
    <table class="user-table">
      <!-- Table headers -->
      <thead>
        <tr>
          <th>N°</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Company</th>
          <th>Phone Number</th>
          <th>Email Verified</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <!-- Table body -->
      <tbody>
        <tr v-for="(user, index) in displayedUsers" :key="index">
          <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td>{{ user.first_name }}</td>
          <td>{{ user.last_name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.company }}</td>
          <td>{{ user.phone_number }}</td>
          <td>{{ user.email_verified_at }}</td>
          <td>{{ user.role }}</td>
          <!-- Action buttons -->
          <td class="action-buttons">
            <span @click="updateUser(index)" class="btn-update">
              <i class="fas fa-edit update-icon"></i>
            </span>
            <span @click="confirmDelete(index)" class="btn-delete">
              <i class="fas fa-trash-alt delete-icon"></i>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage === lastPage">Next</button>
    </div>

    <!-- Update popup -->
    <div v-if="showUpdatePopup" class="popup-background">
      <div class="popup">
        <h2>Edit User</h2>
        <!-- Update form -->
        <form @submit.prevent="saveUpdate">
          <div class="input-group">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" v-model="updatedUser.first_name" />
          </div>
          <div class="input-group">
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" v-model="updatedUser.last_name" />
          </div>
          <div class="input-group">
            <label for="email">Email:</label>
            <input type="text" id="email" v-model="updatedUser.email" />
          </div>
          <div class="input-group">
            <label for="company">Company:</label>
            <input type="text" id="company" v-model="updatedUser.company" />
          </div>
          <div class="input-group">
            <label for="phoneNumber">Phone Number:</label>
            <input type="text" id="phoneNumber" v-model="updatedUser.phone_number" />
          </div>
          <!-- Action buttons -->
          <div class="popup-buttons">
            <button type="button" @click="cancelUpdate">Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      displayedUsers: [],
      showUpdatePopup: false,
      updatedUser: {},
      currentPage: 1,
      pageSize: 10, // Nombre d'utilisateurs par page
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios
        .get('http://dev.back-end.localhost/api/users')
        .then((response) => {
          this.users = response.data.users.filter((user) => user.role === 'user');
          this.updateDisplayedUsers();
        })
        .catch((error) => {
          console.error("An error occurred while fetching users:", error);
        });
    },
    updateDisplayedUsers() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.displayedUsers = this.users.slice(startIndex, endIndex);
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateDisplayedUsers();
      }
    },
    nextPage() {
      if (this.currentPage < this.lastPage) {
        this.currentPage++;
        this.updateDisplayedUsers();
      }
    },
    updateUser(index) {
      this.updatedUser = { ...this.displayedUsers[index] };
      this.showUpdatePopup = true;
    },
    saveUpdate() {
      axios
        .put(`http://dev.back-end.localhost/api/users/${this.updatedUser.id}`, this.updatedUser)
        .then((response) => {
          console.log(response.data.message);
          this.showUpdatePopup = false;
          this.fetchUsers();
        })
        .catch((error) => {
          console.error("An error occurred while updating the user:", error);
        });
    },
    cancelUpdate() {
      this.showUpdatePopup = false;
    },
    confirmDelete(index) {
      if (confirm('Are you sure you want to delete this user?')) {
        const userId = this.displayedUsers[index].id;
        axios
          .delete(`http://dev.back-end.localhost/api/users/${userId}`)
          .then((response) => {
            console.log(response.data.message);
            this.fetchUsers();
          })
          .catch((error) => {
            console.error("An error occurred while deleting the user:", error);
          });
      }
    }
  },
  computed: {
    lastPage() {
      return Math.ceil(this.users.length / this.pageSize);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.title {
  font-size: 32px;
  color: rgb(64, 83, 190);
  margin-bottom: 20px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-table th,
.user-table td {
  border: 1px solid #ddd;
  padding: 10px;
}

.user-table th {
  background-color: #f2f2f2;
}

.action-buttons {
  justify-content: center;
  align-items: center;
}

.action-buttons span {
  margin: 0 5px;
  cursor: pointer;
}

.action-buttons span i {
  font-size: 20px;
}

.user-count {
  font-size: 14px;
  color: #fff9f9;
  background-color: rgb(7, 9, 112);
  padding: 8px;
  display: inline-block;
  border-radius: 4px;
}

.user-count span {
  font-weight: bold;
  color: #fff8f8;
}

.btn-update i:hover {
  color: rgb(12, 16, 238);
}

.btn-delete i:hover {
  color: red;
}

.popup-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 90%;
}

.popup h2 {
  margin-top: 0;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.popup-buttons {
  text-align: right;
}

.popup-buttons button {
  padding: 8px 16px;
  margin-left: 10px;
  cursor: pointer;
}

.popup-buttons button:first-child {
  margin-left: 0;
}

.pagination {
  margin-top: 20px;
}

.pagination button {
  background-color: #f2f2f2;
  border: none;
  color: black;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}
.popup-buttons button:hover {
  background-color: #ddd; /* Couleur de fond au survol */
  color: black; /* Couleur du texte au survol */
}
</style>
