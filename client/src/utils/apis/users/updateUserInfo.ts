import { useUser } from '../../../store/user';

export const updateCoin = async (newCoin: number): Promise<void> => {
  const { user, setUser } = useUser.getState();
  const prevCoin = user.coin;
  setUser({ coin: newCoin + prevCoin });
};
