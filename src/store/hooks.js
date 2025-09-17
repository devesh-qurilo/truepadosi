import { useDispatch, useSelector, useStore } from 'react-redux';

// Custom hooks for Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export const useAppStore = useStore;

// Auth hooks with safety checks
export const useAuth = () => {
  return useAppSelector((state) => state.auth || {});
};

export const useUser = () => {
  return useAppSelector((state) => state.auth?.user || null);
};

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth?.isAuthenticated || false);
};

export const useAuthLoading = () => {
  return useAppSelector((state) => state.auth?.isLoading || false);
};

export const useAuthError = () => {
  return useAppSelector((state) => state.auth?.error || null);
};

// User hooks with safety checks
export const useUserProfile = () => {
  return useAppSelector((state) => state.user?.userProfile || null);
};

export const useUsersList = () => {
  return useAppSelector((state) => state.user?.usersList || []);
};

export const useUserLoading = () => {
  return useAppSelector((state) => state.user?.isLoading || false);
};

export const useUserError = () => {
  return useAppSelector((state) => state.user?.error || null);
};

// Post hooks with safety checks
export const usePosts = () => {
  return useAppSelector((state) => state.post?.posts || []);
};

export const usePostLoading = () => {
  return useAppSelector((state) => state.post?.isLoading || false);
};

export const usePostError = () => {
  return useAppSelector((state) => state.post?.error || null);
};

export const usePagination = () => {
  return {
    currentPage: useAppSelector((state) => state.user?.currentPage || 1),
    totalPages: useAppSelector((state) => state.user?.totalPages || 1),
  };
};

export const useAddress = () => {
  return useAppSelector((state) => state.address || {});
};

export const useAddressLoading = () => {
  return useAppSelector((state) => state.address.isLoading);
};

export const useAddressError = () => {
  return useAppSelector((state) => state.address.error);
};

export const useAddressSubmitted = () => {
  return useAppSelector((state) => state.address.addressSubmitted);
};

export const useVerification = () => {
  return useAppSelector((state) => state.verification || {});
};

export const useVerificationLoading = () => {
  return useAppSelector((state) => state.verification.isLoading);
};

export const useVerificationError = () => {
  return useAppSelector((state) => state.verification.error);
};

export const useVerificationSubmitted = () => {
  return useAppSelector((state) => state.verification.verificationSubmitted);
};

export const useProfession = () => {
  return useAppSelector((state) => state.profession || {});
};

export const useProfessionLoading = () => {
  return useAppSelector((state) => state.profession.isLoading);
};

export const useProfessionError = () => {
  return useAppSelector((state) => state.profession.error);
};

export const useProfessionSubmitted = () => {
  return useAppSelector((state) => state.profession.professionSubmitted);
};

// Combined state hooks
export const useAuthState = () => {
  return {
    user: useUser(),
    isAuthenticated: useIsAuthenticated(),
    isLoading: useAuthLoading(),
    error: useAuthError(),
  };
};

export const useUserState = () => {
  return {
    userProfile: useUserProfile(),
    usersList: useUsersList(),
    isLoading: useUserLoading(),
    error: useUserError(),
    pagination: usePagination(),
  };
};

export const usePostState = () => {
  return {
    posts: usePosts(),
    isLoading: usePostLoading(),
    error: usePostError(),
  };
};