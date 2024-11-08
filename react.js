"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState("transactions")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement actual login logic here
    setIsLoggedIn(true)
    setIsAdmin(true) // For demonstration, set as admin
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Library Management System</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          {isAdmin && <TabsTrigger value="maintenance">Maintenance</TabsTrigger>}
        </TabsList>
        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>
        <TabsContent value="reports">
          <ReportsTab />
        </TabsContent>
        {isAdmin && (
          <TabsContent value="maintenance">
            <MaintenanceTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function LoginForm({ onLogin }: { onLogin: (e: React.FormEvent) => void }) {
  return (
    <Card className="w-[350px] mx-auto mt-20">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onLogin}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your username" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={onLogin}>Log in</Button>
      </CardFooter>
    </Card>
  )
}

function TransactionsTab() {
  return (
    <Tabs defaultValue="book-issue">
      <TabsList>
        <TabsTrigger value="book-issue">Book Issue</TabsTrigger>
        <TabsTrigger value="return-book">Return Book</TabsTrigger>
        <TabsTrigger value="add-membership">Add Membership</TabsTrigger>
      </TabsList>
      <TabsContent value="book-issue">
        <BookIssueForm />
      </TabsContent>
      <TabsContent value="return-book">
        <ReturnBookForm />
      </TabsContent>
      <TabsContent value="add-membership">
        <AddMembershipForm />
      </TabsContent>
    </Tabs>
  )
}

function ReportsTab() {
  return <div>Reports functionality to be implemented</div>
}

function MaintenanceTab() {
  return <div>Maintenance functionality to be implemented</div>
}

function BookIssueForm() {
  const [bookName, setBookName] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date())
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 15))
  )
  const [remarks, setRemarks] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookName || !issueDate || !returnDate) {
      setError("Please fill in all required fields.")
      return
    }
    if (issueDate < new Date()) {
      setError("Issue date cannot be in the past.")
      return
    }
    if (returnDate < issueDate || returnDate > new Date(issueDate.getTime() + 15 * 24 * 60 * 60 * 1000)) {
      setError("Return date must be between issue date and 15 days after issue date.")
      return
    }
    setError("")
    // Process form submission
    console.log("Book issued:", { bookName, authorName, issueDate, returnDate, remarks })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Issue</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="book-name">Name of Book</Label>
              <Input
                id="book-name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="author-name">Name of Author</Label>
              <Input
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={issueDate}
                    onSelect={setIssueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !returnDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Button type="submit" className="mt-4">Issue Book</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ReturnBookForm() {
  const [bookName, setBookName] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [serialNo, setSerialNo] = useState("")
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date())
  const [returnDate, setReturnDate] = useState<Date | undefined>(new Date())
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookName || !serialNo || !issueDate || !returnDate) {
      setError("Please fill in all required fields.")
      return
    }
    setError("")
    // Process form submission
    console.log("Book returned:", { bookName, authorName, serialNo, issueDate, returnDate })
    // Navigate to Fine Pay page
    // This would typically be handled by a router in a full application
    console.log("Navigating to Fine Pay page")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Return Book</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="book-name">Name of Book</Label>
              <Input
                id="book-name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="author-name">Name of Author</Label>
              <Input
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="serial-no">Serial No</Label>
              <Input
                id="serial-no"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={issueDate}
                    onSelect={setIssueDate}
                    initialFocus
                    disabled
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !returnDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Button type="submit" className="mt-4">Confirm Return</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function AddMembershipForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [membershipDuration, setMembershipDuration] = useState("6months")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone) {
      setError("Please fill in all required fields.")
      return
    }
    setError("")
    // Process form submission
    console.log("Membership added:", { name, email, phone, membershipDuration })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Membership</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Membership Duration</Label>
              <RadioGroup value={membershipDuration} onValueChange={setMembershipDuration}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6months" id="6months" />
                  <Label htmlFor="6months">6 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1year" id="1year" />
                  <Label htmlFor="1year">1 year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2years" id="2years" />
                  <Label htmlFor="2years">2 years</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Button type="submit" className="mt-4">Add Membership</Button>
        </form>
      </CardContent>
    </Card>
  )
}
