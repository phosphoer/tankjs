// The MIT License (MIT)
//
// Copyright (c) 2013 David Evans, Killian Koenig
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
//
(function (TANK)
{

  (function (Key)
  {
    // Mouse buttons treated as "key"
    Key.LEFT_MOUSE = 0;
    Key.MIDDLE_MOUSE = 1;
    Key.RIGHT_MOUSE = 2;

    // Special keys
    Key.LEFT_ARROW = 37;
    Key.UP_ARROW = 38;
    Key.RIGHT_ARROW = 39;
    Key.DOWN_ARROW = 40;
    Key.SHIFT = 16;
    Key.BACKSPACE = 8;
    Key.ESCAPE = 27;
    Key.SPACE = 32;
    Key.CONTROL = 17;
    Key.ALT = 18;
    Key.SUPER = 91;
    Key.TILDE = 192;

    // Letters
    Key.A = 65;
    Key.B = 66;
    Key.C = 67;
    Key.D = 68;
    Key.E = 69;
    Key.F = 70;
    Key.G = 71;
    Key.H = 72;
    Key.I = 73;
    Key.J = 74;
    Key.K = 75;
    Key.L = 76;
    Key.M = 77;
    Key.N = 78;
    Key.O = 79;
    Key.P = 80;
    Key.Q = 81;
    Key.R = 82;
    Key.S = 83;
    Key.T = 84;
    Key.U = 85;
    Key.V = 86;
    Key.W = 87;
    Key.X = 88;
    Key.Y = 89;
    Key.Z = 90;

    // Number keys (not numpad)
    Key.NUM1 = 49;
    Key.NUM2 = 50;
    Key.NUM3 = 51;
    Key.NUM4 = 52;
    Key.NUM5 = 53;
    Key.NUM6 = 54;
    Key.NUM7 = 55;
    Key.NUM8 = 56;
    Key.NUM9 = 57;
    Key.NUM0 = 48;
  }(TANK.Key = TANK.Key || {}));

}(this.TANK = this.TANK ||
{}));