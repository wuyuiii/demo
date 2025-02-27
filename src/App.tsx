import { useState } from "react"
import "./App.css"

interface TodoListType {
	id: number
	data: string
	status: number
}

function App() {
	const localStorageList: TodoListType[] = JSON.parse(localStorage.getItem("todoList") as string) || []
	const [todoList, setTodoList] = useState<TodoListType[]>(localStorageList)
	const [allTodoList, setAllTodoList] = useState<TodoListType[]>(localStorageList)
	const [todo, setTodo] = useState("")
	const [showClear, setShowClear] = useState(false)
	const [active, setActive] = useState(0)

	// 监听回车添加
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key !== "Enter") {
			return
		}
		if (todo.trim() === "") {
			return
		}
		const list: TodoListType = {
			id: new Date().getTime(),
			data: todo,
			status: 0, // 0 未完成 1 完成
		}
		const newList = [...todoList, list]
		setTodoList(newList)
		setAllTodoList(newList)
		setTodo("")
		localStorage.setItem("todoList", JSON.stringify(newList))
	}

	// 全选、反选
	const handleChangeAllStatus = () => {
		let allStatus = allTodoList.every((item) => item.status)
		const newList = allTodoList.map((item): TodoListType => {
			return {
				...item,
				status: +!allStatus,
			}
		})
		if (active === 1) {
			setTodoList(newList.filter((item) => !item.status))
		} else if (active === 2) {
			setTodoList(newList.filter((item) => item.status))
		} else {
			setTodoList(newList)
		}
		setAllTodoList(newList)
		setShowClear(!allStatus)
		localStorage.setItem("todoList", JSON.stringify(newList))
	}

	// 单选
	const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>, todo: TodoListType) => {
		const newList = allTodoList.map((item):TodoListType => {
			if (item.id === todo.id) {
				return {
					...item,
					status: e.target?.checked ? 1 : 0,
				}
			}
			return item
		})
		if (active === 1) {
			setTodoList(newList.filter((item) => !item.status))
		} else if (active === 2) {
			setTodoList(newList.filter((item) => item.status))
		} else {
			setTodoList(newList)
		}
		setShowClear(newList.some((item) => item.status))
		setAllTodoList(newList)
		localStorage.setItem("todoList", JSON.stringify(newList))
	}

	// 删除单个
	const handleDelTodo = (todo: TodoListType) => {
		const newList = todoList.filter((item) => {
			return item.id !== todo.id
		})
		setTodoList(newList)
		setAllTodoList(newList)
		localStorage.setItem("todoList", JSON.stringify(newList))
	}

	// 删除多个
	const handleDelCompleted = () => {
		const newList = todoList.filter((item) => !item.status)
		setTodoList(newList)
		setAllTodoList(newList)
		localStorage.setItem("todoList", JSON.stringify(newList))
	}

	// 点击切换状态
	const handleActive = (e: React.MouseEvent<HTMLElement>) => {
		if ((e.target as Element).tagName !== "LI") return
		const dataset = Number((e.target as HTMLElement).dataset?.status)
		document.querySelector(".active")?.classList.remove("active")
		;(e.target as HTMLElement).classList.add("active")
		if (dataset === 0) {
			setActive(0)
			setTodoList(allTodoList)
		} else if (dataset === 1) {
			const newList = allTodoList.filter((item) => !item.status)
			setActive(1)
			setTodoList(newList)
		} else {
			const newList = allTodoList.filter((item) => item.status)
			setActive(2)
			setTodoList(newList)
		}
	}
	return (
		<div className="container">
			<h1 className="logo">todos</h1>
			<section className="content">
				<input type="checkbox" id="all" className="allCheckbox" onChange={handleChangeAllStatus} />
				<label htmlFor="all" className="allLabel" />
				<input
					type="text"
					className="ipt"
					placeholder="What needs to be done"
					value={todo}
					onChange={(e) => setTodo(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				{allTodoList.length > 0 && (
					<ul>
						{todoList.map((todo) => {
							return (
								<li className="lis" key={todo.id}>
									<input
										type="checkbox"
										className="lisCheckbox"
										checked={Boolean(todo.status)}
										onChange={(e) => handleChangeStatus(e, todo)}
									/>
									<span>{todo.data}</span>
									<button
										className="lisDelete"
										onClick={() => {
											handleDelTodo(todo)
										}}
									>
										×
									</button>
								</li>
							)
						})}
					</ul>
				)}
			</section>
			{allTodoList.length > 0 && (
				<footer className="footer">
					<span>{todoList.filter((item) => !item.status).length} items left</span>
					<ul
						className="footerList"
						onClick={(e: React.MouseEvent<HTMLElement>) => handleActive(e)}
					>
						<li className="active" data-status="0">
							All
						</li>
						<li data-status="1">Active</li>
						<li data-status="2">Completed</li>
					</ul>
					<button
						className="footerBtn"
						style={{
							opacity: showClear ? 1 : 0,
							cursor: showClear ? "pointer" : "auto",
						}}
						disabled={!showClear}
						onClick={handleDelCompleted}
					>
						Clear completed
					</button>
				</footer>
			)}
		</div>
	)
}

export default App
