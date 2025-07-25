import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { Trash2, Edit, PlusCircle } from 'lucide-react'; 

export const CrearUsuario = () => { // Componente renombrado a CrearUsuario
    const navigate = useNavigate();
    const isLocalhost = window.location.hostname === 'localhost';
    const API_BASE_URL = isLocalhost
        ? 'http://localhost:3000/api'
        : 'https://novum-app.onrender.com/api';

    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rol: 'usuario', // Rol por defecto al crear
    });
    const [editingUserId, setEditingUserId] = useState(null); // ID del usuario que se está editando
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(''); // Mensajes de éxito o error para el usuario
    const [userRole, setUserRole] = useState(null); // Rol del usuario logueado

    // Verificar el rol del usuario al cargar el componente
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            navigate('/login'); // Redirigir si no hay token
            return;
        }
        try {
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.rol);
            if (decodedToken.rol !== 'admin') {
                setError('Acceso denegado: Solo los administradores pueden gestionar usuarios.');
                setLoading(false);
                return;
            }
        } catch (err) {
            console.error('Error decodificando token:', err);
            navigate('/login'); // Token inválido
            return;
        }
        fetchUsers(); // Si es admin, cargar usuarios
    }, [navigate]); // Dependencia para que se ejecute una vez al montar

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('jwt_token');
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudieron cargar los usuarios.');
            }
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (user) => {
        setEditingUserId(user.id_usuario);
        setFormData({
            email: user.email,
            password: '', // No precargamos la contraseña por seguridad
            rol: user.rol,
        });
        setMessage(''); // Limpiar mensajes al editar
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
        setFormData({ email: '', password: '', rol: 'usuario' });
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const token = localStorage.getItem('jwt_token');
        let url = `${API_BASE_URL}/users`;
        let method = 'POST';

        if (editingUserId) {
            url = `${API_BASE_URL}/users/${editingUserId}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al ${editingUserId ? 'actualizar' : 'crear'} el usuario.`);
            }

            const result = await response.json();
            setMessage(result.message || `Usuario ${editingUserId ? 'actualizado' : 'creado'} exitosamente.`);
            setFormData({ email: '', password: '', rol: 'usuario' }); // Limpiar formulario
            setEditingUserId(null); // Salir del modo edición
            fetchUsers(); // Recargar la lista de usuarios
        } catch (err) {
            setMessage(`Error: ${err.message}`);
            console.error('Error al enviar formulario de usuario:', err);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            return;
        }
        setMessage('');
        const token = localStorage.getItem('jwt_token');
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar el usuario.');
            }

            const result = await response.json();
            setMessage(result.message || 'Usuario eliminado exitosamente.');
            fetchUsers(); // Recargar la lista
        } catch (err) {
            setMessage(`Error: ${err.message}`);
            console.error('Error al eliminar usuario:', err);
        }
    };

    if (loading) return <div className="text-center p-8 text-lg">Cargando usuarios...</div>;
    if (error) return (
        <div className="text-center p-8 text-lg text-red-600">
            {error}
            {userRole === 'admin' && <p className="mt-4 text-gray-700">Asegúrate de tener permisos de administrador y un token válido.</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestión de Usuarios</h1>

                {message && (
                    <div className={`p-3 rounded-md mb-4 ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                {/* Formulario de Creación/Edición */}
                <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        {editingUserId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </h2>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña: {editingUserId && <span className="text-xs text-gray-500">(Deja vacío para no cambiar)</span>}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            {...(!editingUserId && { required: true })} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol:</label>
                        <select
                            id="rol"
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="usuario">Usuario</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                        >
                            {editingUserId ? 'Guardar Cambios' : 'Crear Usuario'}
                        </button>
                        {editingUserId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-400 transition duration-200"
                            >
                                Cancelar Edición
                            </button>
                        )}
                    </div>
                </form>

                {/* Lista de Usuarios */}
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Usuarios Existentes</h2>
                {users.length === 0 ? (
                    <p className="text-gray-600">No hay usuarios registrados.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Rol</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id_usuario} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{user.id_usuario}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{user.email}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 capitalize">{user.rol}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition duration-200"
                                                    title="Editar usuario"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id_usuario)}
                                                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition duration-200"
                                                    title="Eliminar usuario"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

