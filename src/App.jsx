import { useState } from "react"
import "./App.css"
function App() {
	const [todoList, setTodoList] = useState(JSON.parse(localStorage.getItem("todoList")) || [])
	const [allTodoList, setAllTodoList] = useState(JSON.parse(localStorage.getItem("todoList")) || [])
	const [todo, setTodo] = useState("")
	const [showClear, setShowClear] = useState(false)

  // 监听回车添加
	const handleKeyDown = (e) => {
		if (e.key !== "Enter") {
			return
		}
		if (todo.trim() === "") {
			return
		}
		const list = {
			id: new Date().getTime(),
			data: todo,
			status: 0, // 0 未完成 1 完成
		}
		setTodoList([...todoList, list])
    setAllTodoList([...todoList, list])
		setTodo("")
		localStorage.setItem("todoList", JSON.stringify(todoList))
	}

  // 全选、反选
	const handleChangeAllStatus = (e) => {
    let allStatus = todoList.every((item) => item.status)
		const newList = todoList.map((item) => {
			return {
				...item,
				status: !allStatus,
			}
		})
		setTodoList(newList)
    setAllTodoList(newList)
		setShowClear(e.target.checked)
		localStorage.setItem("todoList", JSON.stringify(newList))
	}

  // 单选
	const handleChangeStatus = (e, todo) => {
		const newList = todoList.map((item) => {
			if (item.id === todo.id) {
				return {
					...item,
					status: e.target.checked ? 1 : 0,
				}
			}
			return item
		})
    setShowClear(newList.some((item) => item.status))

		setTodoList(newList)
    setAllTodoList(newList)
		localStorage.setItem("todoList", JSON.stringify(newList))
	}

  // 删除单个
	const handleDelTodo = (todo) => {
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
	const handleActive = (e) => {
		if (e.target.tagName !== "LI") return
		const dataset = +e.target.dataset.status
    document.querySelector(".active").classList.remove("active")
    e.target.classList.add("active")
		if (dataset === 0) {
			setTodoList(allTodoList)
		} else if (dataset === 1) {
			setTodoList(allTodoList.filter((item) => !item.status))
		} else {
			setTodoList(allTodoList.filter((item) => item.status))
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
										checked={todo.status}
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
					<ul className="footerList" onClick={(e) => handleActive(e)}>
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
