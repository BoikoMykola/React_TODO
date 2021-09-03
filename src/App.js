import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ModalAdd from "./ModalAdd";
import EditIcon from '@material-ui/icons/Edit';
import Filter from "./Filter";
import Search from "./Search";
import SearchIcon from '@material-ui/icons/Search';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ViewColumn from "./View";

function createData(name, time, description, tags, priority) {
    return {name, time, description, tags, priority};
}


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {id: 'name', numeric: false, disablePadding: true, label: 'Название'},
    {id: 'time', numeric: false, type: 'dateTime', disablePadding: false, label: 'Дата/время исполнения'},
    {id: 'description', numeric: false, disablePadding: false, label: 'Описание дела'},
    {id: 'tags', numeric: false, disablePadding: false, label: 'Теги'},
    {id: 'priority', numeric: false, disablePadding: false, label: 'Приоритет'},
];

function EnhancedTableHead(props) {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, state} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{'aria-label': 'select all desserts'}}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        className={state[headCell.id] ? '' : classes.display}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    state: PropTypes.object.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));


const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const {numSelected, selected, setSelected, rows, setRows, setTodosWithSave, setState, state} = props;
    const [open, setOpen] = React.useState(false);
    const [openView, setOpenView] = useState(false);
    const [openFilter, setOpenFilter] = React.useState(null);
    const [openNew, setOpenNew] = React.useState(false);
    const [openSearch, setOpenSearch] = React.useState(false);
    const [placement, setPlacement] = React.useState();


    const handlerSearch = (newPlacement) => (event) => {
        setOpenSearch(event.currentTarget);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
    };

    const handlerDelete = () => {
        do {
            let a = rows.findIndex(item => item.name === selected[0]);
            setSelected(selected.splice(0, 1));
            rows.splice(a, 1);
            setTodosWithSave(rows);
        }
        while (selected.length !== 0)

        setSelected([]);
    }


    const handlerEdit = () => {

        let a = rows.findIndex(item => item.name === selected[0]);
        setName(rows[a].name);
        setTime(rows[a].time);
        setDescription(rows[a].description);
        setTags(rows[a].tags);
        setPriority(rows[a].priority);
        setSelected([]);
        rows.splice(a, 1);
        setTodosWithSave(rows);
        setOpenNew(true);
    }

    const handlerOpen = () => {
        setOpenNew(true)
    }

    const handlerView = (event) => {
        setOpenView(openView ? null : event.currentTarget);
    }

    const handlerFilter = (event) => {
        setOpenFilter(openFilter ? null : event.currentTarget);
    };

    const [name, setName] = useState("");
    const [time, setTime] = useState("2021-02-20T10:30");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [priority, setPriority] = useState("");

    const handlerChange = event => {
        switch (event.target.name) {
            case "name":
                setName(event.target.value);
                break;
            case "time":
                setTime(event.target.value);
                break;
            case "description":
                setDescription(event.target.value);
                break;
            case "tags":
                setTags(event.target.value);
                break;
            case "priority":
                setPriority(event.target.value);
                break;
            default:
        }
    };

    const handlerSubmit = event => {

        event.preventDefault();
        let a = createData(name, time, description, tags, priority);
        const data2 = rows.concat([a]);

        setName("");
        setTime("");
        setDescription("");
        setTags("");
        setPriority("");
        setTodosWithSave(data2);
        setOpenNew(false)
    }


    return (
        <>
            <
                Toolbar
                className={clsx(classes.root,
                    {
                        [classes.highlight]:
                        numSelected > 0,
                    }
                )
                }
            >
                {
                    numSelected > 0 ? (
                        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                            {numSelected} выбрано
                        </Typography>
                    ) : (
                        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                            Список дел
                        </Typography>
                    )
                }

                {
                    numSelected > 0 ? (
                        <>
                            <Tooltip title="Удалить">
                                <IconButton aria-label="delete" onClick={handlerDelete}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Редактировать">
                                <IconButton aria-label="delete" disabled={selected.length > 1 ? "disabled" : ""}
                                            onClick={handlerEdit}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Поиск">
                                <IconButton aria-label="search" onClick={handlerSearch('left')}>
                                    <SearchIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Колонки">
                                <IconButton aria-label="search" onClick={handlerView}>
                                    <ViewColumnIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Фильтр">
                                <IconButton aria-label="filter list" onClick={handlerFilter}>
                                    <FilterListIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Добавить дело">
                                <IconButton aria-label="add" onClick={handlerOpen}>
                                    <PostAddIcon/>
                                </IconButton>
                            </Tooltip>
                        </>
                    )
                }
            </Toolbar>
            <ModalAdd openNew={openNew} setOpenNew={setOpenNew} name={name} description={description} time={time}
                      tags={tags}
                      priority={priority}
                      handlerChange={handlerChange} handlerSubmit={handlerSubmit}/>
            <Filter openFilter={openFilter} rows={rows} setRows={setRows}/>
            <Search open={open} openSearch={openSearch} placement={placement} rows={rows} setRows={setRows}/>
            <ViewColumn openView={openView} headCells={headCells} state={state} setState={setState}/>
        </>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    selected: PropTypes.array.isRequired,
    setSelected: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    setRows: PropTypes.func.isRequired,
    setTodosWithSave: PropTypes.func.isRequired,
    setState: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    display: {
        display: "none"
    },
}));

export default function EnhancedTable() {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [state, setState] = useState({
        name: true,
        time: true,
        description: true,
        tags: true,
        priority: true,
    });
    // const [newStyle, setNewStyle] = useState(false);
    const [rows, setRows] = useState(localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const setTodosWithSave = (newRows) => {
        setRows(newRows);
        localStorage.setItem('todos', JSON.stringify(newRows))
    }


    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected}
                                      rows={rows} setRows={setRows} setTodosWithSave={setTodosWithSave} state={state}
                                      setState={setState}/>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            state={state}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.name)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                />
                                            </TableCell>
                                            <TableCell
                                                className={state.name ? '' : classes.display}
                                                // style={state.name ? "" : classes.display }
                                                component="th" id={labelId} scope="row" padding="none">
                                                {row.name}
                                            </TableCell>
                                            <TableCell
                                                className={state.time ? '' : classes.display}
                                            >{row.time}</TableCell>
                                            <TableCell
                                                className={state.description ? '' : classes.display}
                                            >{row.description}</TableCell>
                                            <TableCell
                                                className={state.tags ? '' : classes.display}
                                            >{row.tags}</TableCell>
                                            <TableCell
                                                className={state.priority ? '' : classes.display}
                                            >{row.priority}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense}/>}
                label="Плотное расположение"
            />
        </div>
    );
}