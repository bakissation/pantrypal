<template>
    <div class="apple-theme">
        <form @submit.prevent="loginUser">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required>
            
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required>
            
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        loginUser() {           
            axios.post('http://localhost:3000/login', {
                email: this.email,
                password: this.password
            })
            .then(response => {
                console.log(response)
                const sessionToken = response.data.sessionToken;
                localStorage.setItem('sessionToken', sessionToken);
                
                this.$router.push('/home');
            })
            .catch(error => {
                console.error('Error logging in user:', error);
            });
        }
    }
}
</script>

<style scoped>
.apple-theme {
    background-color: #f2f2f7;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

label {
    font-weight: bold;
    margin-bottom: 10px;
}

input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 300px;
}

button {
    padding: 10px 20px;
    background-color: #007aff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

button:hover {
    background-color: #0056b3;
}
</style>
