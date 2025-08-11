function Navbar() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <NavigationMenu className="container mx-auto max-w-5xl p-3">
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className="font-medium">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/newtrip" >
                  New Trip +
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/newtrip" >
                  Something
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" >
                  Anothethin
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          
        </NavigationMenu>
      </header>

      <main className="container mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Navbar;