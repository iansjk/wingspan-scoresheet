import { StyleSheet } from "react-native";

export default StyleSheet.create({
  placeText: {
    fontSize: 10
  },
  pointText: {
    fontSize: 24
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  switchbar: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  cell: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'black'
  },
  column: {
    flex: 1,
    height: '80%',
    margin: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black'
  },
  columns: {
    flex: 9,
    flexDirection: 'row-reverse'
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});
