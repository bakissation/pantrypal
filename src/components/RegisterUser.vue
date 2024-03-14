<template>
    <div>
        <form @submit="registerUser">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required>
            
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required>
            
            <button type="submit">Register</button>
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
        registerUser(event) {
            event.preventDefault();
            
            axios.post('http://localhost:3000/register', {
                email: this.email,
                password: this.password
            })
            .then(() => {
                console.log('Registration successful');
            })
            .catch(error => {
                console.error('Error registering user:', error);
            });
        }
    }
}
</script>


<style scoped>
div {
    background-color: #F8F8F8;
    border: 1px solid #D3D3D3;
    border-radius: 5px;
    padding: 10px;
}

label {
    font-weight: bold;
    margin-bottom: 10px;
}

input[type="email"],
input[type="password"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 300px;
}

button[type="submit"] {
    padding: 10px 20px;
    background-color: #007aff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

</style>