import { useUser } from '../../../store/user';

export const updateCoin = async (newCoin: number): Promise<void> => {
  const { setUser } = useUser.getState();
  setUser({ coin: newCoin });
};
