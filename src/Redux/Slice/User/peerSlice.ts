import { createSlice } from '@reduxjs/toolkit';

export type PeerState = Record<string, { stream: MediaStream }>;

const initialState: PeerState = {};

const peerSlice = createSlice({
  name: 'peer',
  initialState,
  reducers: {
    addPeer: (state, action) => {
      const { peerId, stream } = action.payload;
      state[peerId] = { stream };
    },
    removePeer: (state, action) => {
      const { [action.payload.peerId]: deleted, ...rest } = state;
      return rest;
    },
  },
});

export const { addPeer, removePeer } = peerSlice.actions;
export default peerSlice.reducer;
