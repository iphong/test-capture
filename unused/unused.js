

/*
 references
 +-----------------+--------------------+
 | Key name        | Keysym value (hex) |
 +-----------------+--------------------+
 | BackSpace       | 0xff08             |
 | Tab             | 0xff09             |
 | Return or Enter | 0xff0d             |
 | Escape          | 0xff1b             |
 | Insert          | 0xff63             |
 | Delete          | 0xffff             |
 | Home            | 0xff50             |
 | End             | 0xff57             |
 | Page Up         | 0xff55             |
 | Page Down       | 0xff56             |
 | Left            | 0xff51             |
 | Up              | 0xff52             |
 | Right           | 0xff53             |
 | Down            | 0xff54             |
 | F1              | 0xffbe             |
 | F2              | 0xffbf             |
 | F3              | 0xffc0             |
 | F4              | 0xffc1             |
 | ...             | ...                |
 | F12             | 0xffc9             |
 | Shift (left)    | 0xffe1             |
 | Shift (right)   | 0xffe2             |
 | Control (left)  | 0xffe3             |
 | Control (right) | 0xffe4             |
 | Meta (left)     | 0xffe7             |
 | Meta (right)    | 0xffe8             |
 | Alt (left)      | 0xffe9             |
 | Alt (right)     | 0xffea             |
 +-----------------+--------------------+
 */

const KEY_CODE_MASKS = {
	8: 0xff08,
	9: 0xff09,
	13: 0xff0d,
	16: 0xffe1, // Shift
	17: 0xffe3, // Option
	18: 0xffe9, // Alt
	27: 0xff1b,
	37: 0xff51,
	38: 0xff52,
	39: 0xff53,
	40: 0xff54,
	91: 0xffe7, // Meta
	112: 0xffbe,
	113: 0xffbf,
	114: 0xffc0,
	115: 0xffc1,
	116: 0xffc2,
	117: 0xffc3,
	118: 0xffc4,
	119: 0xffc5,
	120: 0xffc6,
	121: 0xffc7,
	122: 0xffc8,
	123: 0xffc9
}
const MOUSE_BTN_MASKS = {
	0: 0b00000000,
	1: 0b00000001,
	2: 0b00000010,
	3: 0b00000100
}