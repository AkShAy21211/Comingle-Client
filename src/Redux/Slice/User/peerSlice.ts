import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PeerState = Record<string, { stream: MediaStream }>;

const initialState: PeerState = {};

const peerSlice = createSlice({
  name: 'peer',
  initialState,
  reducers: {
    addPeer: (state, action: PayloadAction<{ userId: string, stream: MediaStream }>) => {
      const { userId, stream } = action.payload;
      state[userId] = { stream };
    },
    removePeer: (state, action: PayloadAction<{ peerId: string }>) => {
      const { peerId } = action.payload;
      delete state[peerId];
    },
  },
});

export const { addPeer, removePeer } = peerSlice.actions;
export default peerSlice.reducer;
