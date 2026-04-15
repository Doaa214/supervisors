"use client";


interface HeaderProps {
  onAddClick: () => void; // دي وظيفة هنبعتها للهيدر من بره
}

function Header({onAddClick}:HeaderProps) {


  return (
    <div className="bg-white border-b border-gray-300 p-5 flex justify-end">
      <button className="bg-blue-900 text-white p-2 rounded-xl flex cursor-pointer" onClick={onAddClick}>
        <span className="material-symbols-outlined mr-2">add_circle</span>
        <span>Add Supervisor</span>
      </button>
    </div>
  );
}

export default Header;
