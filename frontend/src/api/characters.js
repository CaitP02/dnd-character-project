import { api } from './client.js';

export const listCharacters = async (params, signal) => (await api.get('/characters', { params, signal })).data;

export const getCharacter = async (id, signal) => (await api.get(`/characters/${id}`, { signal })).data;

export const createCharacter = async (character) => (await api.post('/characters', character)).data;

export const updateCharacter = async (id, character) => (await api.put(`/characters/${id}`, character)).data;

export const deleteCharacter = async (id) => {
  await api.delete(`/characters/${id}`);
};
