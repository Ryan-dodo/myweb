{/* 负责背景光晕 */}
function AuthCard({ children }) {
  return (
    <div className="glass-card">
      {children}
    </div>
  );
}

export default AuthCard;