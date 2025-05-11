<template>
  <div class="user-management">
    <h1>User Management</h1>
    <ul>
      <li v-for="user in nonAdminUsers" :key="user.id">
        <span>{{ user.username }} ({{ user.email }})</span>
        <button @click="toggleBlockUser(user)">
          {{ user.blocked ? "Unblock" : "Block" }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import UserService from "../services/UserService";

export default {
  name: "UserManagement",
  data() {
    return {
      users: [], // Raw list of users
    };
  },
  computed: {
    // Filter out admin users
    nonAdminUsers() {
      return this.users.filter((user) => {
        return user.roles && !user.roles.includes("admin");
      });
    },
  },
  methods: {
    // Fetch users from the backend
    async fetchUsers() {
      try {
        this.users = await UserService.getAllUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    // Toggle the blocked state of a user
    async toggleBlockUser(user) {
      try {
        if (user.blocked) {
          await UserService.unblockUser(user.id); // Unblock user
        } else {
          await UserService.blockUser(user.id); // Block user
        }
        user.blocked = !user.blocked; // Update the blocked state locally
      } catch (error) {
        console.error(
          `Error ${user.blocked ? "unblocking" : "blocking"} user:`,
          error
        );
      }
    },
  },
  mounted() {
    this.fetchUsers(); // Fetch users on component mount
  },
};
</script>





<style scoped>
/* Add any required styling */
</style>