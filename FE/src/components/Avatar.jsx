export function Avatar() {
    // Retrieve the name from localStorage
    const storedName = localStorage.getItem("name");
  
    // Initialize default values
    let greeting = "User";
    let initial = "U";
  
    if (storedName != "undefined") {
        greeting = storedName;
        initial = storedName[0];
    }
  
    return (
      <div className="flex items-center gap-4 font-Bricolage">
        <div>
          <p className="text-theme-gray-secondary">Hey, {greeting}</p>
        </div>
        <div className="bg-theme-purple-primary border border-theme-purple-secondary rounded-full">
          <div className="flex flex-col justify-center items-center h-8 w-8 text-xl">
            {initial}
          </div>
        </div>
      </div>
    );
  }
  