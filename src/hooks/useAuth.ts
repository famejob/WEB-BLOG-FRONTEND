function useAuth(): boolean {
    return !!localStorage.getItem("token");
}
export default useAuth