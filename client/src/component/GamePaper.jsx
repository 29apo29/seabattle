import { alpha, Paper, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { add, remove } from "../redux/slices/locationSlice";
import { isLocationSuit } from "../helper/valueControls";

const GamePaper = () => {
  const them = useTheme();
  const theme = them.palette;
  return (
    <Paper
      sx={{
        bgcolor: alpha(theme.background.card, 0.5),
        p: 4,
        minHeight: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Arena />
      {/* <Grid2 container sx={{ width: "100%" }}></Grid2> */}
    </Paper>
  );
};

const DraggableElement = ({
  setShadow,
  shadow,
  elementLength,
  startingPoint,
  index,
}) => {
  const theme = useTheme();
  const [startPoint, setStartPoint] = useState(startingPoint);
  const [gridPos, setGridPos] = useState({ x: 0, y: 0 });
  const [inArea, setInArea] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const state = useSelector((e) => e.locations);
  const [warn, setWarn] = useState(false);
  const [animateLocation, setAnimateLocation] = useState({ x: 0, y: 0 });
  useEffect(() => {
    setStartPointGlobal(isHorizontal);
  }, [isSmall]);

  useEffect(() => {
    setAnimateLocation({ x: 29, y: 29 });
    setTimeout(
      () =>
        setAnimateLocation(
          inArea ? { x: gridPos.x, y: gridPos.y } : startPoint
        ),
      6
    );
  }, [gridPos, inArea, startPoint]);

  const isInArea = (x, y) => {
    return !(
      x > TILE_SIZE * GRID_SIZE + GRID_SIZE / 2 ||
      x < (GRID_SIZE / 2) * -1 ||
      y > TILE_SIZE * GRID_SIZE + GRID_SIZE / 2 ||
      y < (GRID_SIZE / 2) * -1
    );
  };

  const handleDragEnd = (event, info) => {
    // Elemanın sol üst köşesinin en yakın grid noktasına kilitlenmesi için hesaplama
    //console.log(gridPos.x+info.offset.x , gridPos.y+info.offset.y )
    // console.log(Math.round((gridPos.x+info.offset.x)/ TILE_SIZE) * TILE_SIZE, Math.round((gridPos.y+info.offset.y)/ TILE_SIZE) * TILE_SIZE)
    // if (warn) {
    //   console.log("here");
    //   setShadow({ ...shadow, isActive: false, length: elementLength });
    //   dispatch(remove(index));
    //   setTimeout(() => {
    //     setGridPos({ x: 0, y: 0 });
    //     setInArea(false);
    //   }, 20);
    //   return;
    // }
    if (!inArea) {
      info.offset.x = info.offset.x + startPoint.x;
      info.offset.y = info.offset.y + startPoint.y;
    }
    // setGridPos({ x: info.offset.x, y: info.offset.y });
    let newX = gridPos.x + Math.round(info.offset.x / TILE_SIZE) * TILE_SIZE;
    let newY = gridPos.y + Math.round(info.offset.y / TILE_SIZE) * TILE_SIZE;

    if (!isInArea(newX, newY) || warn) {
      console.log("here");
      newX = 0;
      newY = 0;
      setShadow({ ...shadow, isActive: false, length: elementLength });
      setInArea(false);
      dispatch(remove(index));
    } else {
      // Grid sınırlarının dışına çıkmasını engelle (Min-Max ile kısıtlama)
      newX = isHorizontal
        ? Math.max(0, Math.min((GRID_SIZE - elementLength) * TILE_SIZE, newX))
        : Math.max(0, Math.min((GRID_SIZE - 1) * TILE_SIZE, newX));
      newY = isHorizontal
        ? Math.max(0, Math.min((GRID_SIZE - 1) * TILE_SIZE, newY))
        : Math.max(0, Math.min((GRID_SIZE - elementLength) * TILE_SIZE, newY));
      let x = newX / TILE_SIZE;
      let y = newY / TILE_SIZE;
      setShadow({
        ...shadow,
        isActive: true,
        start: y * GRID_SIZE + x,
        length: elementLength,
      });
      setInArea(true);
      dispatch(
        add({ index, isHorizontal, length: elementLength, location: { x, y } })
      );
    }
    // console.log(info.offset.x, newX, info.offset.y, newY, isInArea(newX, newY));
    // Yeni pozisyonu ayarla
    setTimeout(() => setGridPos({ x: newX, y: newY }), 5);

    // setGridPos({ x: newX, y: newY });
  };

  const handleDragStart = (event, info) => {
    dispatch(remove(index));
  };
  const handleDrag = (event, info) => {
    if (!inArea) {
      info.offset.x = info.offset.x + startPoint.x;
      info.offset.y = info.offset.y + startPoint.y;
    }
    let newX = gridPos.x + Math.round(info.offset.x / TILE_SIZE) * TILE_SIZE;
    let newY = gridPos.y + Math.round(info.offset.y / TILE_SIZE) * TILE_SIZE;
    newX = isHorizontal
      ? Math.max(0, Math.min((GRID_SIZE - elementLength) * TILE_SIZE, newX))
      : Math.max(0, Math.min((GRID_SIZE - 1) * TILE_SIZE, newX));
    newY = isHorizontal
      ? Math.max(0, Math.min((GRID_SIZE - 1) * TILE_SIZE, newY))
      : Math.max(0, Math.min((GRID_SIZE - elementLength) * TILE_SIZE, newY));
    let x = newX / TILE_SIZE;
    let y = newY / TILE_SIZE;
    let warn = !isLocationSuit(
      state.filled,
      { isHorizontal, length: elementLength, location: { x, y } },
      GRID_SIZE
    );
    setWarn(warn);
    if (isInArea(newX, newY))
      setShadow({
        ...shadow,
        isActive: true,
        start: y * GRID_SIZE + x,
        length: elementLength,
        isHorizontal,
        warn,
      });
    else
      setShadow({
        ...shadow,
        isActive: false,
        length: elementLength,
        isHorizontal,
        warn,
      });
  };

  const setStartPointGlobal = (horizant) => {
    setStartPoint(
      !isSmall
        ? horizant
          ? startingPoint
          : {
              x: TILE_SIZE * -1.5 * ((index % 3) + 1),
              y: Math.floor(index / 3) * (TILE_SIZE * 6),
            }
        : horizant
        ? {
            y: TILE_SIZE * -1.1 * (index + 1),
            x: 0,
          }
        : {
            x: index * TILE_SIZE + index * 10,
            y: TILE_SIZE * GRID_SIZE + TILE_SIZE * 0.5,
          }
    );
  };

  const doubleClickHandle = (e) => {
    setStartPointGlobal(!isHorizontal);
    if (inArea) {
      dispatch(remove(index));
      let warn = !isLocationSuit(
        state.filled,
        {
          isHorizontal: !isHorizontal,
          length: elementLength,
          location: {
            x: isHorizontal
              ? gridPos.x / TILE_SIZE
              : gridPos.x / TILE_SIZE + 1,
            y: isHorizontal
              ? gridPos.y / TILE_SIZE + 1
              : gridPos.y / TILE_SIZE,
          },
        },
        GRID_SIZE
      );
      setWarn(warn);
      setInArea(!warn);
      if (!warn)
        dispatch(
          add({
            index,
            isHorizontal: !isHorizontal,
            length: elementLength,
            location: { x: gridPos.x / TILE_SIZE, y: gridPos.y / TILE_SIZE },
          })
        );
      else setGridPos({x:0,y:0});
    }
    setIsHorizontal(!isHorizontal);
    setShadow({
      ...shadow,
      start: gridPos.y * GRID_SIZE + gridPos.x,
      length: elementLength,
      isHorizontal: !shadow.isHorizontal,
      isActive: false,
    });
  };

  return (
    <motion.div
      onDoubleClick={doubleClickHandle}
      drag
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      dragMomentum={false} // Sürükleme bırakıldığında kaymayı önler
      onDragEnd={handleDragEnd} // Bırakıldığında grid'e hizala
      animate={animateLocation}
      transition={{ type: "spring", stiffness: 900, damping: 50 }}
      style={{
        width: isHorizontal ? elementLength * TILE_SIZE : TILE_SIZE,
        height: !isHorizontal ? elementLength * TILE_SIZE : TILE_SIZE,
        backgroundColor: "blue",
        position: "absolute",
        borderRadius: 8,
        cursor: "grab",
      }}
    />
  );
};

const GRID_SIZE = 8;
const TILE_SIZE = 40;

const Arena = () => {
  const [shadow, setShadow] = useState({
    isActive: false,
    start: 0,
    length: 3,
    isHorizontal: true,
    warn: false,
  });
  const ships = [
    { index: 0, length: 5 },
    { index: 1, length: 4 },
    { index: 2, length: 3 },
    { index: 3, length: 3 },
    { index: 4, length: 2 },
  ];
  return (
    <>
      <div
        style={{
          width: GRID_SIZE * TILE_SIZE,
          height: GRID_SIZE * TILE_SIZE,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
          position: "relative",
          backgroundColor: "#ddd",
          border: "4px solid black",
        }}
      >
        {/* Grid Çizgilerini Göster */}
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (
          <div
            key={index}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              border: "1px solid black",
              boxSizing: "border-box",
              backgroundColor: shadow.isActive
                ? shadow.isHorizontal
                  ? shadow.start + shadow.length - 1 >= index &&
                    shadow.start <= index
                    ? shadow.warn
                      ? "darkred"
                      : "gray"
                    : "white"
                  : [...Array(shadow.length)]
                      .map((_, i) => shadow.start + i * GRID_SIZE)
                      .indexOf(index) !== -1
                  ? shadow.warn
                    ? "darkred"
                    : "gray"
                  : "white"
                : "white",

              transition: "all 0.1s",
            }}
          />
        ))}

        {/* Sürüklenebilir Eleman */}
        {ships.map((e) => (
          <DraggableElement
            key={e.index}
            index={e.index}
            elementLength={e.length}
            startingPoint={{
              x: GRID_SIZE * (TILE_SIZE + 1),
              y: TILE_SIZE * e.index * 1.5,
            }}
            setShadow={setShadow}
            shadow={shadow}
          />
        ))}
        {/* <DraggableElement
          elementLength={3}
          startingPoint={{ x: GRID_SIZE * (TILE_SIZE + 1), y: 0 }}
          setShadow={setShadow}
          shadow={shadow}
        />
        <DraggableElement
          elementLength={4}
          startingPoint={{ x: GRID_SIZE * (TILE_SIZE + 1), y: TILE_SIZE * 1.5 }}
          setShadow={setShadow}
          shadow={shadow}
        /> */}
      </div>
    </>
  );
};

export default GamePaper;
