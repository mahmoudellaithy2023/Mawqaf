const CommunityLayout = ({ sidebar, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 font-sans text-foreground">
      <div className="mx-auto max-w-[1400px] px-4 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">{sidebar}</aside>

          {/* Main Content */}
          <main className="w-full">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;

// const CommunityLayout = ({ sidebar, children }) => {
//   return (
//     <div
//       className="min-h-screen pt-24"
//       style={{ backgroundColor: "var(--community-bg)" }}
//     >
//       <div className="mx-auto max-w-[1200px] px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
//           <aside className="hidden lg:block">{sidebar}</aside>
//           <main className="space-y-6">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommunityLayout;
