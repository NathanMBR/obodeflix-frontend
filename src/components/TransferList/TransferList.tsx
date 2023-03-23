import {
    Button,
    Card,
    CardHeader,
    Checkbox,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import {
    ReactNode,
    useState
} from "react";

type Comparable = number | string;
export interface TransferListProps<T extends Comparable> {
    leftList: Array<T>;
    rightList?: Array<T>;
    handleChosen: (chosen: Array<T>) => void;
    sx?: CSSProperties;
};

export const TransferList = <T extends Comparable>(props: TransferListProps<T>) => {
  const {
    leftList,
    rightList,
    handleChosen,
    sx
  } = props;

  const height = leftList.length * 50.1;

  function not(a: readonly T[], b: readonly T[]) {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  
  function intersection(a: readonly T[], b: readonly T[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }
  
  function union(a: readonly T[], b: readonly T[]) {
    return [...a, ...not(b, a)];
  }

  const [checked, setChecked] = useState<readonly T[]>([]);
  const [left, setLeft] = useState<readonly T[]>(leftList);
  const [right, setRight] = useState<readonly T[]>(rightList || []);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: T) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    currentIndex === -1
        ? newChecked.push(value)
        : newChecked.splice(currentIndex, 1);

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly T[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly T[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    const rightToCheck = right.concat(leftChecked);
    setRight(rightToCheck);
    handleChosen(rightToCheck);
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    const rightToCheck = not(right, rightChecked);
    setRight(rightToCheck);
    handleChosen(rightToCheck);
    setChecked(not(checked, rightChecked));
  };

  interface CustomListProps {
    title: ReactNode;
    items: readonly T[];
    hideSubheader?: boolean;
    sx?: CSSProperties;
  }

  const CustomList = (props: CustomListProps) => {
    const {
      title,
      items,
      hideSubheader,
      sx
    } = props;

    return (
        <Card sx={sx}>
          <CardHeader
            sx={{ px: 2, py: 1 }}
            avatar={
              <Checkbox
                onClick={handleToggleAll(items)}
                checked={numberOfChecked(items) === items.length && items.length !== 0}
                indeterminate={
                  numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                }
                disabled={items.length === 0}
                inputProps={{
                  'aria-label': 'Todos os itens selecionados',
                }}
              />
            }
            title={title}
            subheader={
              hideSubheader
                ? undefined
                : `${numberOfChecked(items)}/${items.length} selecionados`
            }
          />
          <Divider />
          <List
            sx={{
              width: 500,
              height,
              bgcolor: 'background.paper',
              overflow: 'auto'
            }}
            dense
            component="div"
            role="list"
          >
            {items.map((value: T) => {
              const labelId = `transfer-list-all-item-${value}-label`;
    
              return (
                <ListItem
                  key={value}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${value}`} />
                </ListItem>
              );
            })}
          </List>
        </Card>
      );
  }

  return (
    <Grid container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={sx}
    >
      <Grid item>
        <CustomList
          title="Escolhas"
          items={left}
        />
      </Grid>
      <Grid item
        sx={{ height }}
      >
        <Grid container direction="column">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="Mover selecionados p/ direita"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="Mover selecionados p/ esquerda"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <CustomList
          title="Escolhidos"
          items={right}
          hideSubheader
        />
      </Grid>
    </Grid>
  );
};