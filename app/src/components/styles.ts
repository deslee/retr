import { makeStyles, fade } from "@material-ui/core"

const useStyle = makeStyles(theme => ({
    sprint: {
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column"
    },
    columns: {
        display: 'flex',
    },
    toolbarTitle: {
        flexGrow: 1
    },
    column: {
        flex: 1,
        margin: theme.spacing(1),
        padding: theme.spacing(2, 2),
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        '&$isDragging': {
            opacity: 0
        },
        '&$canDrop': {
            // background: theme.palette.action.hover
        },
        '&$isOver': {
            background: theme.palette.action.selected
        },
    },
    card: {
        '&$canDrop': {
        },
        '&$isOver': {
            background: fade(theme.palette.primary.dark, 0.3)
        },
        '&$isDragging': {
            opacity: 0.9
        }
    },
    canDrop: {},
    isOver: {},
    isDragging: {}
}))

export default useStyle