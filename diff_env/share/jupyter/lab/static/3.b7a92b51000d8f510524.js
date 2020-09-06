(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "dfh3":
/*!***********************************************!*\
  !*** ./node_modules/codemirror/keymap/vim.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

/**
 * Supported keybindings:
 *   Too many to list. Refer to defaultKeymap below.
 *
 * Supported Ex commands:
 *   Refer to defaultExCommandMap below.
 *
 * Registers: unnamed, -, a-z, A-Z, 0-9
 *   (Does not respect the special case for number registers when delete
 *    operator is made with these commands: %, (, ),  , /, ?, n, N, {, } )
 *   TODO: Implement the remaining registers.
 *
 * Marks: a-z, A-Z, and 0-9
 *   TODO: Implement the remaining special marks. They have more complex
 *       behavior.
 *
 * Events:
 *  'vim-mode-change' - raised on the editor anytime the current mode changes,
 *                      Event object: {mode: "visual", subMode: "linewise"}
 *
 * Code structure:
 *  1. Default keymap
 *  2. Variable declarations and short basic helpers
 *  3. Instance (External API) implementation
 *  4. Internal state tracking objects (input state, counter) implementation
 *     and instantiation
 *  5. Key handler (the main command dispatcher) implementation
 *  6. Motion, operator, and action implementations
 *  7. Helper functions for the key handler, motions, operators, and actions
 *  8. Set up Vim to work as a keymap for CodeMirror.
 *  9. Ex command implementations.
 */

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(/*! ../lib/codemirror */ "VrN/"), __webpack_require__(/*! ../addon/search/searchcursor */ "uTOq"), __webpack_require__(/*! ../addon/dialog/dialog */ "Ku0u"), __webpack_require__(/*! ../addon/edit/matchbrackets.js */ "jDMi"));
  else {}
})(function(CodeMirror) {
  'use strict';

  var defaultKeymap = [
    // Key to key mapping. This goes first to make it possible to override
    // existing mappings.
    { keys: '<Left>', type: 'keyToKey', toKeys: 'h' },
    { keys: '<Right>', type: 'keyToKey', toKeys: 'l' },
    { keys: '<Up>', type: 'keyToKey', toKeys: 'k' },
    { keys: '<Down>', type: 'keyToKey', toKeys: 'j' },
    { keys: '<Space>', type: 'keyToKey', toKeys: 'l' },
    { keys: '<BS>', type: 'keyToKey', toKeys: 'h', context: 'normal'},
    { keys: '<Del>', type: 'keyToKey', toKeys: 'x', context: 'normal'},
    { keys: '<C-Space>', type: 'keyToKey', toKeys: 'W' },
    { keys: '<C-BS>', type: 'keyToKey', toKeys: 'B', context: 'normal' },
    { keys: '<S-Space>', type: 'keyToKey', toKeys: 'w' },
    { keys: '<S-BS>', type: 'keyToKey', toKeys: 'b', context: 'normal' },
    { keys: '<C-n>', type: 'keyToKey', toKeys: 'j' },
    { keys: '<C-p>', type: 'keyToKey', toKeys: 'k' },
    { keys: '<C-[>', type: 'keyToKey', toKeys: '<Esc>' },
    { keys: '<C-c>', type: 'keyToKey', toKeys: '<Esc>' },
    { keys: '<C-[>', type: 'keyToKey', toKeys: '<Esc>', context: 'insert' },
    { keys: '<C-c>', type: 'keyToKey', toKeys: '<Esc>', context: 'insert' },
    { keys: 's', type: 'keyToKey', toKeys: 'cl', context: 'normal' },
    { keys: 's', type: 'keyToKey', toKeys: 'c', context: 'visual'},
    { keys: 'S', type: 'keyToKey', toKeys: 'cc', context: 'normal' },
    { keys: 'S', type: 'keyToKey', toKeys: 'VdO', context: 'visual' },
    { keys: '<Home>', type: 'keyToKey', toKeys: '0' },
    { keys: '<End>', type: 'keyToKey', toKeys: '$' },
    { keys: '<PageUp>', type: 'keyToKey', toKeys: '<C-b>' },
    { keys: '<PageDown>', type: 'keyToKey', toKeys: '<C-f>' },
    { keys: '<CR>', type: 'keyToKey', toKeys: 'j^', context: 'normal' },
    { keys: '<Ins>', type: 'action', action: 'toggleOverwrite', context: 'insert' },
    // Motions
    { keys: 'H', type: 'motion', motion: 'moveToTopLine', motionArgs: { linewise: true, toJumplist: true }},
    { keys: 'M', type: 'motion', motion: 'moveToMiddleLine', motionArgs: { linewise: true, toJumplist: true }},
    { keys: 'L', type: 'motion', motion: 'moveToBottomLine', motionArgs: { linewise: true, toJumplist: true }},
    { keys: 'h', type: 'motion', motion: 'moveByCharacters', motionArgs: { forward: false }},
    { keys: 'l', type: 'motion', motion: 'moveByCharacters', motionArgs: { forward: true }},
    { keys: 'j', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, linewise: true }},
    { keys: 'k', type: 'motion', motion: 'moveByLines', motionArgs: { forward: false, linewise: true }},
    { keys: 'gj', type: 'motion', motion: 'moveByDisplayLines', motionArgs: { forward: true }},
    { keys: 'gk', type: 'motion', motion: 'moveByDisplayLines', motionArgs: { forward: false }},
    { keys: 'w', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: false }},
    { keys: 'W', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: false, bigWord: true }},
    { keys: 'e', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: true, inclusive: true }},
    { keys: 'E', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: true, bigWord: true, inclusive: true }},
    { keys: 'b', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false }},
    { keys: 'B', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false, bigWord: true }},
    { keys: 'ge', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: true, inclusive: true }},
    { keys: 'gE', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: true, bigWord: true, inclusive: true }},
    { keys: '{', type: 'motion', motion: 'moveByParagraph', motionArgs: { forward: false, toJumplist: true }},
    { keys: '}', type: 'motion', motion: 'moveByParagraph', motionArgs: { forward: true, toJumplist: true }},
    { keys: '(', type: 'motion', motion: 'moveBySentence', motionArgs: { forward: false }},
    { keys: ')', type: 'motion', motion: 'moveBySentence', motionArgs: { forward: true }},
    { keys: '<C-f>', type: 'motion', motion: 'moveByPage', motionArgs: { forward: true }},
    { keys: '<C-b>', type: 'motion', motion: 'moveByPage', motionArgs: { forward: false }},
    { keys: '<C-d>', type: 'motion', motion: 'moveByScroll', motionArgs: { forward: true, explicitRepeat: true }},
    { keys: '<C-u>', type: 'motion', motion: 'moveByScroll', motionArgs: { forward: false, explicitRepeat: true }},
    { keys: 'gg', type: 'motion', motion: 'moveToLineOrEdgeOfDocument', motionArgs: { forward: false, explicitRepeat: true, linewise: true, toJumplist: true }},
    { keys: 'G', type: 'motion', motion: 'moveToLineOrEdgeOfDocument', motionArgs: { forward: true, explicitRepeat: true, linewise: true, toJumplist: true }},
    { keys: '0', type: 'motion', motion: 'moveToStartOfLine' },
    { keys: '^', type: 'motion', motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: '+', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, toFirstChar:true }},
    { keys: '-', type: 'motion', motion: 'moveByLines', motionArgs: { forward: false, toFirstChar:true }},
    { keys: '_', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, toFirstChar:true, repeatOffset:-1 }},
    { keys: '$', type: 'motion', motion: 'moveToEol', motionArgs: { inclusive: true }},
    { keys: '%', type: 'motion', motion: 'moveToMatchedSymbol', motionArgs: { inclusive: true, toJumplist: true }},
    { keys: 'f<character>', type: 'motion', motion: 'moveToCharacter', motionArgs: { forward: true , inclusive: true }},
    { keys: 'F<character>', type: 'motion', motion: 'moveToCharacter', motionArgs: { forward: false }},
    { keys: 't<character>', type: 'motion', motion: 'moveTillCharacter', motionArgs: { forward: true, inclusive: true }},
    { keys: 'T<character>', type: 'motion', motion: 'moveTillCharacter', motionArgs: { forward: false }},
    { keys: ';', type: 'motion', motion: 'repeatLastCharacterSearch', motionArgs: { forward: true }},
    { keys: ',', type: 'motion', motion: 'repeatLastCharacterSearch', motionArgs: { forward: false }},
    { keys: '\'<character>', type: 'motion', motion: 'goToMark', motionArgs: {toJumplist: true, linewise: true}},
    { keys: '`<character>', type: 'motion', motion: 'goToMark', motionArgs: {toJumplist: true}},
    { keys: ']`', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: true } },
    { keys: '[`', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: false } },
    { keys: ']\'', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: true, linewise: true } },
    { keys: '[\'', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: false, linewise: true } },
    // the next two aren't motions but must come before more general motion declarations
    { keys: ']p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: true, isEdit: true, matchIndent: true}},
    { keys: '[p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: false, isEdit: true, matchIndent: true}},
    { keys: ']<character>', type: 'motion', motion: 'moveToSymbol', motionArgs: { forward: true, toJumplist: true}},
    { keys: '[<character>', type: 'motion', motion: 'moveToSymbol', motionArgs: { forward: false, toJumplist: true}},
    { keys: '|', type: 'motion', motion: 'moveToColumn'},
    { keys: 'o', type: 'motion', motion: 'moveToOtherHighlightedEnd', context:'visual'},
    { keys: 'O', type: 'motion', motion: 'moveToOtherHighlightedEnd', motionArgs: {sameLine: true}, context:'visual'},
    // Operators
    { keys: 'd', type: 'operator', operator: 'delete' },
    { keys: 'y', type: 'operator', operator: 'yank' },
    { keys: 'c', type: 'operator', operator: 'change' },
    { keys: '=', type: 'operator', operator: 'indentAuto' },
    { keys: '>', type: 'operator', operator: 'indent', operatorArgs: { indentRight: true }},
    { keys: '<', type: 'operator', operator: 'indent', operatorArgs: { indentRight: false }},
    { keys: 'g~', type: 'operator', operator: 'changeCase' },
    { keys: 'gu', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: true}, isEdit: true },
    { keys: 'gU', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: false}, isEdit: true },
    { keys: 'n', type: 'motion', motion: 'findNext', motionArgs: { forward: true, toJumplist: true }},
    { keys: 'N', type: 'motion', motion: 'findNext', motionArgs: { forward: false, toJumplist: true }},
    // Operator-Motion dual commands
    { keys: 'x', type: 'operatorMotion', operator: 'delete', motion: 'moveByCharacters', motionArgs: { forward: true }, operatorMotionArgs: { visualLine: false }},
    { keys: 'X', type: 'operatorMotion', operator: 'delete', motion: 'moveByCharacters', motionArgs: { forward: false }, operatorMotionArgs: { visualLine: true }},
    { keys: 'D', type: 'operatorMotion', operator: 'delete', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
    { keys: 'D', type: 'operator', operator: 'delete', operatorArgs: { linewise: true }, context: 'visual'},
    { keys: 'Y', type: 'operatorMotion', operator: 'yank', motion: 'expandToLine', motionArgs: { linewise: true }, context: 'normal'},
    { keys: 'Y', type: 'operator', operator: 'yank', operatorArgs: { linewise: true }, context: 'visual'},
    { keys: 'C', type: 'operatorMotion', operator: 'change', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
    { keys: 'C', type: 'operator', operator: 'change', operatorArgs: { linewise: true }, context: 'visual'},
    { keys: '~', type: 'operatorMotion', operator: 'changeCase', motion: 'moveByCharacters', motionArgs: { forward: true }, operatorArgs: { shouldMoveCursor: true }, context: 'normal'},
    { keys: '~', type: 'operator', operator: 'changeCase', context: 'visual'},
    { keys: '<C-w>', type: 'operatorMotion', operator: 'delete', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false }, context: 'insert' },
    //ignore C-w in normal mode
    { keys: '<C-w>', type: 'idle', context: 'normal' },
    // Actions
    { keys: '<C-i>', type: 'action', action: 'jumpListWalk', actionArgs: { forward: true }},
    { keys: '<C-o>', type: 'action', action: 'jumpListWalk', actionArgs: { forward: false }},
    { keys: '<C-e>', type: 'action', action: 'scroll', actionArgs: { forward: true, linewise: true }},
    { keys: '<C-y>', type: 'action', action: 'scroll', actionArgs: { forward: false, linewise: true }},
    { keys: 'a', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'charAfter' }, context: 'normal' },
    { keys: 'A', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'eol' }, context: 'normal' },
    { keys: 'A', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'endOfSelectedArea' }, context: 'visual' },
    { keys: 'i', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'inplace' }, context: 'normal' },
    { keys: 'I', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'firstNonBlank'}, context: 'normal' },
    { keys: 'I', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'startOfSelectedArea' }, context: 'visual' },
    { keys: 'o', type: 'action', action: 'newLineAndEnterInsertMode', isEdit: true, interlaceInsertRepeat: true, actionArgs: { after: true }, context: 'normal' },
    { keys: 'O', type: 'action', action: 'newLineAndEnterInsertMode', isEdit: true, interlaceInsertRepeat: true, actionArgs: { after: false }, context: 'normal' },
    { keys: 'v', type: 'action', action: 'toggleVisualMode' },
    { keys: 'V', type: 'action', action: 'toggleVisualMode', actionArgs: { linewise: true }},
    { keys: '<C-v>', type: 'action', action: 'toggleVisualMode', actionArgs: { blockwise: true }},
    { keys: '<C-q>', type: 'action', action: 'toggleVisualMode', actionArgs: { blockwise: true }},
    { keys: 'gv', type: 'action', action: 'reselectLastSelection' },
    { keys: 'J', type: 'action', action: 'joinLines', isEdit: true },
    { keys: 'p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: true, isEdit: true }},
    { keys: 'P', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: false, isEdit: true }},
    { keys: 'r<character>', type: 'action', action: 'replace', isEdit: true },
    { keys: '@<character>', type: 'action', action: 'replayMacro' },
    { keys: 'q<character>', type: 'action', action: 'enterMacroRecordMode' },
    // Handle Replace-mode as a special case of insert mode.
    { keys: 'R', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { replace: true }},
    { keys: 'u', type: 'action', action: 'undo', context: 'normal' },
    { keys: 'u', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: true}, context: 'visual', isEdit: true },
    { keys: 'U', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: false}, context: 'visual', isEdit: true },
    { keys: '<C-r>', type: 'action', action: 'redo' },
    { keys: 'm<character>', type: 'action', action: 'setMark' },
    { keys: '"<character>', type: 'action', action: 'setRegister' },
    { keys: 'zz', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'center' }},
    { keys: 'z.', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'center' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: 'zt', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'top' }},
    { keys: 'z<CR>', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'top' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: 'z-', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'bottom' }},
    { keys: 'zb', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'bottom' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: '.', type: 'action', action: 'repeatLastEdit' },
    { keys: '<C-a>', type: 'action', action: 'incrementNumberToken', isEdit: true, actionArgs: {increase: true, backtrack: false}},
    { keys: '<C-x>', type: 'action', action: 'incrementNumberToken', isEdit: true, actionArgs: {increase: false, backtrack: false}},
    { keys: '<C-t>', type: 'action', action: 'indent', actionArgs: { indentRight: true }, context: 'insert' },
    { keys: '<C-d>', type: 'action', action: 'indent', actionArgs: { indentRight: false }, context: 'insert' },
    // Text object motions
    { keys: 'a<character>', type: 'motion', motion: 'textObjectManipulation' },
    { keys: 'i<character>', type: 'motion', motion: 'textObjectManipulation', motionArgs: { textObjectInner: true }},
    // Search
    { keys: '/', type: 'search', searchArgs: { forward: true, querySrc: 'prompt', toJumplist: true }},
    { keys: '?', type: 'search', searchArgs: { forward: false, querySrc: 'prompt', toJumplist: true }},
    { keys: '*', type: 'search', searchArgs: { forward: true, querySrc: 'wordUnderCursor', wholeWordOnly: true, toJumplist: true }},
    { keys: '#', type: 'search', searchArgs: { forward: false, querySrc: 'wordUnderCursor', wholeWordOnly: true, toJumplist: true }},
    { keys: 'g*', type: 'search', searchArgs: { forward: true, querySrc: 'wordUnderCursor', toJumplist: true }},
    { keys: 'g#', type: 'search', searchArgs: { forward: false, querySrc: 'wordUnderCursor', toJumplist: true }},
    // Ex command
    { keys: ':', type: 'ex' }
  ];
  var defaultKeymapLength = defaultKeymap.length;

  /**
   * Ex commands
   * Care must be taken when adding to the default Ex command map. For any
   * pair of commands that have a shared prefix, at least one of their
   * shortNames must not match the prefix of the other command.
   */
  var defaultExCommandMap = [
    { name: 'colorscheme', shortName: 'colo' },
    { name: 'map' },
    { name: 'imap', shortName: 'im' },
    { name: 'nmap', shortName: 'nm' },
    { name: 'vmap', shortName: 'vm' },
    { name: 'unmap' },
    { name: 'write', shortName: 'w' },
    { name: 'undo', shortName: 'u' },
    { name: 'redo', shortName: 'red' },
    { name: 'set', shortName: 'se' },
    { name: 'set', shortName: 'se' },
    { name: 'setlocal', shortName: 'setl' },
    { name: 'setglobal', shortName: 'setg' },
    { name: 'sort', shortName: 'sor' },
    { name: 'substitute', shortName: 's', possiblyAsync: true },
    { name: 'nohlsearch', shortName: 'noh' },
    { name: 'yank', shortName: 'y' },
    { name: 'delmarks', shortName: 'delm' },
    { name: 'registers', shortName: 'reg', excludeFromCommandHistory: true },
    { name: 'global', shortName: 'g' }
  ];

  var Pos = CodeMirror.Pos;

  var Vim = function() {
    function enterVimMode(cm) {
      cm.setOption('disableInput', true);
      cm.setOption('showCursorWhenSelecting', false);
      CodeMirror.signal(cm, "vim-mode-change", {mode: "normal"});
      cm.on('cursorActivity', onCursorActivity);
      maybeInitVimState(cm);
      CodeMirror.on(cm.getInputField(), 'paste', getOnPasteFn(cm));
    }

    function leaveVimMode(cm) {
      cm.setOption('disableInput', false);
      cm.off('cursorActivity', onCursorActivity);
      CodeMirror.off(cm.getInputField(), 'paste', getOnPasteFn(cm));
      cm.state.vim = null;
    }

    function detachVimMap(cm, next) {
      if (this == CodeMirror.keyMap.vim) {
        CodeMirror.rmClass(cm.getWrapperElement(), "cm-fat-cursor");
        if (cm.getOption("inputStyle") == "contenteditable" && document.body.style.caretColor != null) {
          disableFatCursorMark(cm);
          cm.getInputField().style.caretColor = "";
        }
      }

      if (!next || next.attach != attachVimMap)
        leaveVimMode(cm);
    }
    function attachVimMap(cm, prev) {
      if (this == CodeMirror.keyMap.vim) {
        CodeMirror.addClass(cm.getWrapperElement(), "cm-fat-cursor");
        if (cm.getOption("inputStyle") == "contenteditable" && document.body.style.caretColor != null) {
          enableFatCursorMark(cm);
          cm.getInputField().style.caretColor = "transparent";
        }
      }

      if (!prev || prev.attach != attachVimMap)
        enterVimMode(cm);
    }

    function updateFatCursorMark(cm) {
      if (!cm.state.fatCursorMarks) return;
      clearFatCursorMark(cm);
      var ranges = cm.listSelections(), result = []
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i]
        if (range.empty()) {
          if (range.anchor.ch < cm.getLine(range.anchor.line).length) {
            result.push(cm.markText(range.anchor, Pos(range.anchor.line, range.anchor.ch + 1),
                                    {className: "cm-fat-cursor-mark"}))
          } else {
            var widget = document.createElement("span")
            widget.textContent = "\u00a0"
            widget.className = "cm-fat-cursor-mark"
            result.push(cm.setBookmark(range.anchor, {widget: widget}))
          }
        }
      }
      cm.state.fatCursorMarks = result;
    }

    function clearFatCursorMark(cm) {
      var marks = cm.state.fatCursorMarks;
      if (marks) for (var i = 0; i < marks.length; i++) marks[i].clear();
    }

    function enableFatCursorMark(cm) {
      cm.state.fatCursorMarks = [];
      updateFatCursorMark(cm)
      cm.on("cursorActivity", updateFatCursorMark)
    }

    function disableFatCursorMark(cm) {
      clearFatCursorMark(cm);
      cm.off("cursorActivity", updateFatCursorMark);
      // explicitly set fatCursorMarks to null because event listener above
      // can be invoke after removing it, if off is called from operation
      cm.state.fatCursorMarks = null;
    }

    // Deprecated, simply setting the keymap works again.
    CodeMirror.defineOption('vimMode', false, function(cm, val, prev) {
      if (val && cm.getOption("keyMap") != "vim")
        cm.setOption("keyMap", "vim");
      else if (!val && prev != CodeMirror.Init && /^vim/.test(cm.getOption("keyMap")))
        cm.setOption("keyMap", "default");
    });

    function cmKey(key, cm) {
      if (!cm) { return undefined; }
      if (this[key]) { return this[key]; }
      var vimKey = cmKeyToVimKey(key);
      if (!vimKey) {
        return false;
      }
      var cmd = CodeMirror.Vim.findKey(cm, vimKey);
      if (typeof cmd == 'function') {
        CodeMirror.signal(cm, 'vim-keypress', vimKey);
      }
      return cmd;
    }

    var modifiers = {'Shift': 'S', 'Ctrl': 'C', 'Alt': 'A', 'Cmd': 'D', 'Mod': 'A'};
    var specialKeys = {Enter:'CR',Backspace:'BS',Delete:'Del',Insert:'Ins'};
    function cmKeyToVimKey(key) {
      if (key.charAt(0) == '\'') {
        // Keypress character binding of format "'a'"
        return key.charAt(1);
      }
      var pieces = key.split(/-(?!$)/);
      var lastPiece = pieces[pieces.length - 1];
      if (pieces.length == 1 && pieces[0].length == 1) {
        // No-modifier bindings use literal character bindings above. Skip.
        return false;
      } else if (pieces.length == 2 && pieces[0] == 'Shift' && lastPiece.length == 1) {
        // Ignore Shift+char bindings as they should be handled by literal character.
        return false;
      }
      var hasCharacter = false;
      for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        if (piece in modifiers) { pieces[i] = modifiers[piece]; }
        else { hasCharacter = true; }
        if (piece in specialKeys) { pieces[i] = specialKeys[piece]; }
      }
      if (!hasCharacter) {
        // Vim does not support modifier only keys.
        return false;
      }
      // TODO: Current bindings expect the character to be lower case, but
      // it looks like vim key notation uses upper case.
      if (isUpperCase(lastPiece)) {
        pieces[pieces.length - 1] = lastPiece.toLowerCase();
      }
      return '<' + pieces.join('-') + '>';
    }

    function getOnPasteFn(cm) {
      var vim = cm.state.vim;
      if (!vim.onPasteFn) {
        vim.onPasteFn = function() {
          if (!vim.insertMode) {
            cm.setCursor(offsetCursor(cm.getCursor(), 0, 1));
            actions.enterInsertMode(cm, {}, vim);
          }
        };
      }
      return vim.onPasteFn;
    }

    var numberRegex = /[\d]/;
    var wordCharTest = [CodeMirror.isWordChar, function(ch) {
      return ch && !CodeMirror.isWordChar(ch) && !/\s/.test(ch);
    }], bigWordCharTest = [function(ch) {
      return /\S/.test(ch);
    }];
    function makeKeyRange(start, size) {
      var keys = [];
      for (var i = start; i < start + size; i++) {
        keys.push(String.fromCharCode(i));
      }
      return keys;
    }
    var upperCaseAlphabet = makeKeyRange(65, 26);
    var lowerCaseAlphabet = makeKeyRange(97, 26);
    var numbers = makeKeyRange(48, 10);
    var validMarks = [].concat(upperCaseAlphabet, lowerCaseAlphabet, numbers, ['<', '>']);
    var validRegisters = [].concat(upperCaseAlphabet, lowerCaseAlphabet, numbers, ['-', '"', '.', ':', '/']);

    function isLine(cm, line) {
      return line >= cm.firstLine() && line <= cm.lastLine();
    }
    function isLowerCase(k) {
      return (/^[a-z]$/).test(k);
    }
    function isMatchableSymbol(k) {
      return '()[]{}'.indexOf(k) != -1;
    }
    function isNumber(k) {
      return numberRegex.test(k);
    }
    function isUpperCase(k) {
      return (/^[A-Z]$/).test(k);
    }
    function isWhiteSpaceString(k) {
      return (/^\s*$/).test(k);
    }
    function isEndOfSentenceSymbol(k) {
      return '.?!'.indexOf(k) != -1;
    }
    function inArray(val, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          return true;
        }
      }
      return false;
    }

    var options = {};
    function defineOption(name, defaultValue, type, aliases, callback) {
      if (defaultValue === undefined && !callback) {
        throw Error('defaultValue is required unless callback is provided');
      }
      if (!type) { type = 'string'; }
      options[name] = {
        type: type,
        defaultValue: defaultValue,
        callback: callback
      };
      if (aliases) {
        for (var i = 0; i < aliases.length; i++) {
          options[aliases[i]] = options[name];
        }
      }
      if (defaultValue) {
        setOption(name, defaultValue);
      }
    }

    function setOption(name, value, cm, cfg) {
      var option = options[name];
      cfg = cfg || {};
      var scope = cfg.scope;
      if (!option) {
        return new Error('Unknown option: ' + name);
      }
      if (option.type == 'boolean') {
        if (value && value !== true) {
          return new Error('Invalid argument: ' + name + '=' + value);
        } else if (value !== false) {
          // Boolean options are set to true if value is not defined.
          value = true;
        }
      }
      if (option.callback) {
        if (scope !== 'local') {
          option.callback(value, undefined);
        }
        if (scope !== 'global' && cm) {
          option.callback(value, cm);
        }
      } else {
        if (scope !== 'local') {
          option.value = option.type == 'boolean' ? !!value : value;
        }
        if (scope !== 'global' && cm) {
          cm.state.vim.options[name] = {value: value};
        }
      }
    }

    function getOption(name, cm, cfg) {
      var option = options[name];
      cfg = cfg || {};
      var scope = cfg.scope;
      if (!option) {
        return new Error('Unknown option: ' + name);
      }
      if (option.callback) {
        var local = cm && option.callback(undefined, cm);
        if (scope !== 'global' && local !== undefined) {
          return local;
        }
        if (scope !== 'local') {
          return option.callback();
        }
        return;
      } else {
        var local = (scope !== 'global') && (cm && cm.state.vim.options[name]);
        return (local || (scope !== 'local') && option || {}).value;
      }
    }

    defineOption('filetype', undefined, 'string', ['ft'], function(name, cm) {
      // Option is local. Do nothing for global.
      if (cm === undefined) {
        return;
      }
      // The 'filetype' option proxies to the CodeMirror 'mode' option.
      if (name === undefined) {
        var mode = cm.getOption('mode');
        return mode == 'null' ? '' : mode;
      } else {
        var mode = name == '' ? 'null' : name;
        cm.setOption('mode', mode);
      }
    });

    var createCircularJumpList = function() {
      var size = 100;
      var pointer = -1;
      var head = 0;
      var tail = 0;
      var buffer = new Array(size);
      function add(cm, oldCur, newCur) {
        var current = pointer % size;
        var curMark = buffer[current];
        function useNextSlot(cursor) {
          var next = ++pointer % size;
          var trashMark = buffer[next];
          if (trashMark) {
            trashMark.clear();
          }
          buffer[next] = cm.setBookmark(cursor);
        }
        if (curMark) {
          var markPos = curMark.find();
          // avoid recording redundant cursor position
          if (markPos && !cursorEqual(markPos, oldCur)) {
            useNextSlot(oldCur);
          }
        } else {
          useNextSlot(oldCur);
        }
        useNextSlot(newCur);
        head = pointer;
        tail = pointer - size + 1;
        if (tail < 0) {
          tail = 0;
        }
      }
      function move(cm, offset) {
        pointer += offset;
        if (pointer > head) {
          pointer = head;
        } else if (pointer < tail) {
          pointer = tail;
        }
        var mark = buffer[(size + pointer) % size];
        // skip marks that are temporarily removed from text buffer
        if (mark && !mark.find()) {
          var inc = offset > 0 ? 1 : -1;
          var newCur;
          var oldCur = cm.getCursor();
          do {
            pointer += inc;
            mark = buffer[(size + pointer) % size];
            // skip marks that are the same as current position
            if (mark &&
                (newCur = mark.find()) &&
                !cursorEqual(oldCur, newCur)) {
              break;
            }
          } while (pointer < head && pointer > tail);
        }
        return mark;
      }
      return {
        cachedCursor: undefined, //used for # and * jumps
        add: add,
        move: move
      };
    };

    // Returns an object to track the changes associated insert mode.  It
    // clones the object that is passed in, or creates an empty object one if
    // none is provided.
    var createInsertModeChanges = function(c) {
      if (c) {
        // Copy construction
        return {
          changes: c.changes,
          expectCursorActivityForChange: c.expectCursorActivityForChange
        };
      }
      return {
        // Change list
        changes: [],
        // Set to true on change, false on cursorActivity.
        expectCursorActivityForChange: false
      };
    };

    function MacroModeState() {
      this.latestRegister = undefined;
      this.isPlaying = false;
      this.isRecording = false;
      this.replaySearchQueries = [];
      this.onRecordingDone = undefined;
      this.lastInsertModeChanges = createInsertModeChanges();
    }
    MacroModeState.prototype = {
      exitMacroRecordMode: function() {
        var macroModeState = vimGlobalState.macroModeState;
        if (macroModeState.onRecordingDone) {
          macroModeState.onRecordingDone(); // close dialog
        }
        macroModeState.onRecordingDone = undefined;
        macroModeState.isRecording = false;
      },
      enterMacroRecordMode: function(cm, registerName) {
        var register =
            vimGlobalState.registerController.getRegister(registerName);
        if (register) {
          register.clear();
          this.latestRegister = registerName;
          if (cm.openDialog) {
            this.onRecordingDone = cm.openDialog(
                '(recording)['+registerName+']', null, {bottom:true});
          }
          this.isRecording = true;
        }
      }
    };

    function maybeInitVimState(cm) {
      if (!cm.state.vim) {
        // Store instance state in the CodeMirror object.
        cm.state.vim = {
          inputState: new InputState(),
          // Vim's input state that triggered the last edit, used to repeat
          // motions and operators with '.'.
          lastEditInputState: undefined,
          // Vim's action command before the last edit, used to repeat actions
          // with '.' and insert mode repeat.
          lastEditActionCommand: undefined,
          // When using jk for navigation, if you move from a longer line to a
          // shorter line, the cursor may clip to the end of the shorter line.
          // If j is pressed again and cursor goes to the next line, the
          // cursor should go back to its horizontal position on the longer
          // line if it can. This is to keep track of the horizontal position.
          lastHPos: -1,
          // Doing the same with screen-position for gj/gk
          lastHSPos: -1,
          // The last motion command run. Cleared if a non-motion command gets
          // executed in between.
          lastMotion: null,
          marks: {},
          // Mark for rendering fake cursor for visual mode.
          fakeCursor: null,
          insertMode: false,
          // Repeat count for changes made in insert mode, triggered by key
          // sequences like 3,i. Only exists when insertMode is true.
          insertModeRepeat: undefined,
          visualMode: false,
          // If we are in visual line mode. No effect if visualMode is false.
          visualLine: false,
          visualBlock: false,
          lastSelection: null,
          lastPastedText: null,
          sel: {},
          // Buffer-local/window-local values of vim options.
          options: {}
        };
      }
      return cm.state.vim;
    }
    var vimGlobalState;
    function resetVimGlobalState() {
      vimGlobalState = {
        // The current search query.
        searchQuery: null,
        // Whether we are searching backwards.
        searchIsReversed: false,
        // Replace part of the last substituted pattern
        lastSubstituteReplacePart: undefined,
        jumpList: createCircularJumpList(),
        macroModeState: new MacroModeState,
        // Recording latest f, t, F or T motion command.
        lastCharacterSearch: {increment:0, forward:true, selectedCharacter:''},
        registerController: new RegisterController({}),
        // search history buffer
        searchHistoryController: new HistoryController(),
        // ex Command history buffer
        exCommandHistoryController : new HistoryController()
      };
      for (var optionName in options) {
        var option = options[optionName];
        option.value = option.defaultValue;
      }
    }

    var lastInsertModeKeyTimer;
    var vimApi= {
      buildKeyMap: function() {
        // TODO: Convert keymap into dictionary format for fast lookup.
      },
      // Testing hook, though it might be useful to expose the register
      // controller anyways.
      getRegisterController: function() {
        return vimGlobalState.registerController;
      },
      // Testing hook.
      resetVimGlobalState_: resetVimGlobalState,

      // Testing hook.
      getVimGlobalState_: function() {
        return vimGlobalState;
      },

      // Testing hook.
      maybeInitVimState_: maybeInitVimState,

      suppressErrorLogging: false,

      InsertModeKey: InsertModeKey,
      map: function(lhs, rhs, ctx) {
        // Add user defined key bindings.
        exCommandDispatcher.map(lhs, rhs, ctx);
      },
      unmap: function(lhs, ctx) {
        exCommandDispatcher.unmap(lhs, ctx);
      },
      // Non-recursive map function.
      // NOTE: This will not create mappings to key maps that aren't present
      // in the default key map. See TODO at bottom of function.
      noremap: function(lhs, rhs, ctx) {
        function toCtxArray(ctx) {
          return ctx ? [ctx] : ['normal', 'insert', 'visual'];
        }
        var ctxsToMap = toCtxArray(ctx);
        // Look through all actual defaults to find a map candidate.
        var actualLength = defaultKeymap.length, origLength = defaultKeymapLength;
        for (var i = actualLength - origLength;
             i < actualLength && ctxsToMap.length;
             i++) {
          var mapping = defaultKeymap[i];
          // Omit mappings that operate in the wrong context(s) and those of invalid type.
          if (mapping.keys == rhs &&
              (!ctx || !mapping.context || mapping.context === ctx) &&
              mapping.type.substr(0, 2) !== 'ex' &&
              mapping.type.substr(0, 3) !== 'key') {
            // Make a shallow copy of the original keymap entry.
            var newMapping = {};
            for (var key in mapping) {
              newMapping[key] = mapping[key];
            }
            // Modify it point to the new mapping with the proper context.
            newMapping.keys = lhs;
            if (ctx && !newMapping.context) {
              newMapping.context = ctx;
            }
            // Add it to the keymap with a higher priority than the original.
            this._mapCommand(newMapping);
            // Record the mapped contexts as complete.
            var mappedCtxs = toCtxArray(mapping.context);
            ctxsToMap = ctxsToMap.filter(function(el) { return mappedCtxs.indexOf(el) === -1; });
          }
        }
        // TODO: Create non-recursive keyToKey mappings for the unmapped contexts once those exist.
      },
      // Remove all user-defined mappings for the provided context.
      mapclear: function(ctx) {
        // Partition the existing keymap into user-defined and true defaults.
        var actualLength = defaultKeymap.length,
            origLength = defaultKeymapLength;
        var userKeymap = defaultKeymap.slice(0, actualLength - origLength);
        defaultKeymap = defaultKeymap.slice(actualLength - origLength);
        if (ctx) {
          // If a specific context is being cleared, we need to keep mappings
          // from all other contexts.
          for (var i = userKeymap.length - 1; i >= 0; i--) {
            var mapping = userKeymap[i];
            if (ctx !== mapping.context) {
              if (mapping.context) {
                this._mapCommand(mapping);
              } else {
                // `mapping` applies to all contexts so create keymap copies
                // for each context except the one being cleared.
                var contexts = ['normal', 'insert', 'visual'];
                for (var j in contexts) {
                  if (contexts[j] !== ctx) {
                    var newMapping = {};
                    for (var key in mapping) {
                      newMapping[key] = mapping[key];
                    }
                    newMapping.context = contexts[j];
                    this._mapCommand(newMapping);
                  }
                }
              }
            }
          }
        }
      },
      // TODO: Expose setOption and getOption as instance methods. Need to decide how to namespace
      // them, or somehow make them work with the existing CodeMirror setOption/getOption API.
      setOption: setOption,
      getOption: getOption,
      defineOption: defineOption,
      defineEx: function(name, prefix, func){
        if (!prefix) {
          prefix = name;
        } else if (name.indexOf(prefix) !== 0) {
          throw new Error('(Vim.defineEx) "'+prefix+'" is not a prefix of "'+name+'", command not registered');
        }
        exCommands[name]=func;
        exCommandDispatcher.commandMap_[prefix]={name:name, shortName:prefix, type:'api'};
      },
      handleKey: function (cm, key, origin) {
        var command = this.findKey(cm, key, origin);
        if (typeof command === 'function') {
          return command();
        }
      },
      /**
       * This is the outermost function called by CodeMirror, after keys have
       * been mapped to their Vim equivalents.
       *
       * Finds a command based on the key (and cached keys if there is a
       * multi-key sequence). Returns `undefined` if no key is matched, a noop
       * function if a partial match is found (multi-key), and a function to
       * execute the bound command if a a key is matched. The function always
       * returns true.
       */
      findKey: function(cm, key, origin) {
        var vim = maybeInitVimState(cm);
        function handleMacroRecording() {
          var macroModeState = vimGlobalState.macroModeState;
          if (macroModeState.isRecording) {
            if (key == 'q') {
              macroModeState.exitMacroRecordMode();
              clearInputState(cm);
              return true;
            }
            if (origin != 'mapping') {
              logKey(macroModeState, key);
            }
          }
        }
        function handleEsc() {
          if (key == '<Esc>') {
            // Clear input state and get back to normal mode.
            clearInputState(cm);
            if (vim.visualMode) {
              exitVisualMode(cm);
            } else if (vim.insertMode) {
              exitInsertMode(cm);
            }
            return true;
          }
        }
        function doKeyToKey(keys) {
          // TODO: prevent infinite recursion.
          var match;
          while (keys) {
            // Pull off one command key, which is either a single character
            // or a special sequence wrapped in '<' and '>', e.g. '<Space>'.
            match = (/<\w+-.+?>|<\w+>|./).exec(keys);
            key = match[0];
            keys = keys.substring(match.index + key.length);
            CodeMirror.Vim.handleKey(cm, key, 'mapping');
          }
        }

        function handleKeyInsertMode() {
          if (handleEsc()) { return true; }
          var keys = vim.inputState.keyBuffer = vim.inputState.keyBuffer + key;
          var keysAreChars = key.length == 1;
          var match = commandDispatcher.matchCommand(keys, defaultKeymap, vim.inputState, 'insert');
          // Need to check all key substrings in insert mode.
          while (keys.length > 1 && match.type != 'full') {
            var keys = vim.inputState.keyBuffer = keys.slice(1);
            var thisMatch = commandDispatcher.matchCommand(keys, defaultKeymap, vim.inputState, 'insert');
            if (thisMatch.type != 'none') { match = thisMatch; }
          }
          if (match.type == 'none') { clearInputState(cm); return false; }
          else if (match.type == 'partial') {
            if (lastInsertModeKeyTimer) { window.clearTimeout(lastInsertModeKeyTimer); }
            lastInsertModeKeyTimer = window.setTimeout(
              function() { if (vim.insertMode && vim.inputState.keyBuffer) { clearInputState(cm); } },
              getOption('insertModeEscKeysTimeout'));
            return !keysAreChars;
          }

          if (lastInsertModeKeyTimer) { window.clearTimeout(lastInsertModeKeyTimer); }
          if (keysAreChars) {
            var selections = cm.listSelections();
            for (var i = 0; i < selections.length; i++) {
              var here = selections[i].head;
              cm.replaceRange('', offsetCursor(here, 0, -(keys.length - 1)), here, '+input');
            }
            vimGlobalState.macroModeState.lastInsertModeChanges.changes.pop();
          }
          clearInputState(cm);
          return match.command;
        }

        function handleKeyNonInsertMode() {
          if (handleMacroRecording() || handleEsc()) { return true; }

          var keys = vim.inputState.keyBuffer = vim.inputState.keyBuffer + key;
          if (/^[1-9]\d*$/.test(keys)) { return true; }

          var keysMatcher = /^(\d*)(.*)$/.exec(keys);
          if (!keysMatcher) { clearInputState(cm); return false; }
          var context = vim.visualMode ? 'visual' :
                                         'normal';
          var match = commandDispatcher.matchCommand(keysMatcher[2] || keysMatcher[1], defaultKeymap, vim.inputState, context);
          if (match.type == 'none') { clearInputState(cm); return false; }
          else if (match.type == 'partial') { return true; }

          vim.inputState.keyBuffer = '';
          var keysMatcher = /^(\d*)(.*)$/.exec(keys);
          if (keysMatcher[1] && keysMatcher[1] != '0') {
            vim.inputState.pushRepeatDigit(keysMatcher[1]);
          }
          return match.command;
        }

        var command;
        if (vim.insertMode) { command = handleKeyInsertMode(); }
        else { command = handleKeyNonInsertMode(); }
        if (command === false) {
          return !vim.insertMode && key.length === 1 ? function() { return true; } : undefined;
        } else if (command === true) {
          // TODO: Look into using CodeMirror's multi-key handling.
          // Return no-op since we are caching the key. Counts as handled, but
          // don't want act on it just yet.
          return function() { return true; };
        } else {
          return function() {
            return cm.operation(function() {
              cm.curOp.isVimOp = true;
              try {
                if (command.type == 'keyToKey') {
                  doKeyToKey(command.toKeys);
                } else {
                  commandDispatcher.processCommand(cm, vim, command);
                }
              } catch (e) {
                // clear VIM state in case it's in a bad state.
                cm.state.vim = undefined;
                maybeInitVimState(cm);
                if (!CodeMirror.Vim.suppressErrorLogging) {
                  console['log'](e);
                }
                throw e;
              }
              return true;
            });
          };
        }
      },
      handleEx: function(cm, input) {
        exCommandDispatcher.processCommand(cm, input);
      },

      defineMotion: defineMotion,
      defineAction: defineAction,
      defineOperator: defineOperator,
      mapCommand: mapCommand,
      _mapCommand: _mapCommand,

      defineRegister: defineRegister,

      exitVisualMode: exitVisualMode,
      exitInsertMode: exitInsertMode
    };

    // Represents the current input state.
    function InputState() {
      this.prefixRepeat = [];
      this.motionRepeat = [];

      this.operator = null;
      this.operatorArgs = null;
      this.motion = null;
      this.motionArgs = null;
      this.keyBuffer = []; // For matching multi-key commands.
      this.registerName = null; // Defaults to the unnamed register.
    }
    InputState.prototype.pushRepeatDigit = function(n) {
      if (!this.operator) {
        this.prefixRepeat = this.prefixRepeat.concat(n);
      } else {
        this.motionRepeat = this.motionRepeat.concat(n);
      }
    };
    InputState.prototype.getRepeat = function() {
      var repeat = 0;
      if (this.prefixRepeat.length > 0 || this.motionRepeat.length > 0) {
        repeat = 1;
        if (this.prefixRepeat.length > 0) {
          repeat *= parseInt(this.prefixRepeat.join(''), 10);
        }
        if (this.motionRepeat.length > 0) {
          repeat *= parseInt(this.motionRepeat.join(''), 10);
        }
      }
      return repeat;
    };

    function clearInputState(cm, reason) {
      cm.state.vim.inputState = new InputState();
      CodeMirror.signal(cm, 'vim-command-done', reason);
    }

    /*
     * Register stores information about copy and paste registers.  Besides
     * text, a register must store whether it is linewise (i.e., when it is
     * pasted, should it insert itself into a new line, or should the text be
     * inserted at the cursor position.)
     */
    function Register(text, linewise, blockwise) {
      this.clear();
      this.keyBuffer = [text || ''];
      this.insertModeChanges = [];
      this.searchQueries = [];
      this.linewise = !!linewise;
      this.blockwise = !!blockwise;
    }
    Register.prototype = {
      setText: function(text, linewise, blockwise) {
        this.keyBuffer = [text || ''];
        this.linewise = !!linewise;
        this.blockwise = !!blockwise;
      },
      pushText: function(text, linewise) {
        // if this register has ever been set to linewise, use linewise.
        if (linewise) {
          if (!this.linewise) {
            this.keyBuffer.push('\n');
          }
          this.linewise = true;
        }
        this.keyBuffer.push(text);
      },
      pushInsertModeChanges: function(changes) {
        this.insertModeChanges.push(createInsertModeChanges(changes));
      },
      pushSearchQuery: function(query) {
        this.searchQueries.push(query);
      },
      clear: function() {
        this.keyBuffer = [];
        this.insertModeChanges = [];
        this.searchQueries = [];
        this.linewise = false;
      },
      toString: function() {
        return this.keyBuffer.join('');
      }
    };

    /**
     * Defines an external register.
     *
     * The name should be a single character that will be used to reference the register.
     * The register should support setText, pushText, clear, and toString(). See Register
     * for a reference implementation.
     */
    function defineRegister(name, register) {
      var registers = vimGlobalState.registerController.registers;
      if (!name || name.length != 1) {
        throw Error('Register name must be 1 character');
      }
      if (registers[name]) {
        throw Error('Register already defined ' + name);
      }
      registers[name] = register;
      validRegisters.push(name);
    }

    /*
     * vim registers allow you to keep many independent copy and paste buffers.
     * See http://usevim.com/2012/04/13/registers/ for an introduction.
     *
     * RegisterController keeps the state of all the registers.  An initial
     * state may be passed in.  The unnamed register '"' will always be
     * overridden.
     */
    function RegisterController(registers) {
      this.registers = registers;
      this.unnamedRegister = registers['"'] = new Register();
      registers['.'] = new Register();
      registers[':'] = new Register();
      registers['/'] = new Register();
    }
    RegisterController.prototype = {
      pushText: function(registerName, operator, text, linewise, blockwise) {
        if (linewise && text.charAt(text.length - 1) !== '\n'){
          text += '\n';
        }
        // Lowercase and uppercase registers refer to the same register.
        // Uppercase just means append.
        var register = this.isValidRegister(registerName) ?
            this.getRegister(registerName) : null;
        // if no register/an invalid register was specified, things go to the
        // default registers
        if (!register) {
          switch (operator) {
            case 'yank':
              // The 0 register contains the text from the most recent yank.
              this.registers['0'] = new Register(text, linewise, blockwise);
              break;
            case 'delete':
            case 'change':
              if (text.indexOf('\n') == -1) {
                // Delete less than 1 line. Update the small delete register.
                this.registers['-'] = new Register(text, linewise);
              } else {
                // Shift down the contents of the numbered registers and put the
                // deleted text into register 1.
                this.shiftNumericRegisters_();
                this.registers['1'] = new Register(text, linewise);
              }
              break;
          }
          // Make sure the unnamed register is set to what just happened
          this.unnamedRegister.setText(text, linewise, blockwise);
          return;
        }

        // If we've gotten to this point, we've actually specified a register
        var append = isUpperCase(registerName);
        if (append) {
          register.pushText(text, linewise);
        } else {
          register.setText(text, linewise, blockwise);
        }
        // The unnamed register always has the same value as the last used
        // register.
        this.unnamedRegister.setText(register.toString(), linewise);
      },
      // Gets the register named @name.  If one of @name doesn't already exist,
      // create it.  If @name is invalid, return the unnamedRegister.
      getRegister: function(name) {
        if (!this.isValidRegister(name)) {
          return this.unnamedRegister;
        }
        name = name.toLowerCase();
        if (!this.registers[name]) {
          this.registers[name] = new Register();
        }
        return this.registers[name];
      },
      isValidRegister: function(name) {
        return name && inArray(name, validRegisters);
      },
      shiftNumericRegisters_: function() {
        for (var i = 9; i >= 2; i--) {
          this.registers[i] = this.getRegister('' + (i - 1));
        }
      }
    };
    function HistoryController() {
        this.historyBuffer = [];
        this.iterator = 0;
        this.initialPrefix = null;
    }
    HistoryController.prototype = {
      // the input argument here acts a user entered prefix for a small time
      // until we start autocompletion in which case it is the autocompleted.
      nextMatch: function (input, up) {
        var historyBuffer = this.historyBuffer;
        var dir = up ? -1 : 1;
        if (this.initialPrefix === null) this.initialPrefix = input;
        for (var i = this.iterator + dir; up ? i >= 0 : i < historyBuffer.length; i+= dir) {
          var element = historyBuffer[i];
          for (var j = 0; j <= element.length; j++) {
            if (this.initialPrefix == element.substring(0, j)) {
              this.iterator = i;
              return element;
            }
          }
        }
        // should return the user input in case we reach the end of buffer.
        if (i >= historyBuffer.length) {
          this.iterator = historyBuffer.length;
          return this.initialPrefix;
        }
        // return the last autocompleted query or exCommand as it is.
        if (i < 0 ) return input;
      },
      pushInput: function(input) {
        var index = this.historyBuffer.indexOf(input);
        if (index > -1) this.historyBuffer.splice(index, 1);
        if (input.length) this.historyBuffer.push(input);
      },
      reset: function() {
        this.initialPrefix = null;
        this.iterator = this.historyBuffer.length;
      }
    };
    var commandDispatcher = {
      matchCommand: function(keys, keyMap, inputState, context) {
        var matches = commandMatches(keys, keyMap, context, inputState);
        if (!matches.full && !matches.partial) {
          return {type: 'none'};
        } else if (!matches.full && matches.partial) {
          return {type: 'partial'};
        }

        var bestMatch;
        for (var i = 0; i < matches.full.length; i++) {
          var match = matches.full[i];
          if (!bestMatch) {
            bestMatch = match;
          }
        }
        if (bestMatch.keys.slice(-11) == '<character>') {
          var character = lastChar(keys);
          if (!character) return {type: 'none'};
          inputState.selectedCharacter = character;
        }
        return {type: 'full', command: bestMatch};
      },
      processCommand: function(cm, vim, command) {
        vim.inputState.repeatOverride = command.repeatOverride;
        switch (command.type) {
          case 'motion':
            this.processMotion(cm, vim, command);
            break;
          case 'operator':
            this.processOperator(cm, vim, command);
            break;
          case 'operatorMotion':
            this.processOperatorMotion(cm, vim, command);
            break;
          case 'action':
            this.processAction(cm, vim, command);
            break;
          case 'search':
            this.processSearch(cm, vim, command);
            break;
          case 'ex':
          case 'keyToEx':
            this.processEx(cm, vim, command);
            break;
          default:
            break;
        }
      },
      processMotion: function(cm, vim, command) {
        vim.inputState.motion = command.motion;
        vim.inputState.motionArgs = copyArgs(command.motionArgs);
        this.evalInput(cm, vim);
      },
      processOperator: function(cm, vim, command) {
        var inputState = vim.inputState;
        if (inputState.operator) {
          if (inputState.operator == command.operator) {
            // Typing an operator twice like 'dd' makes the operator operate
            // linewise
            inputState.motion = 'expandToLine';
            inputState.motionArgs = { linewise: true };
            this.evalInput(cm, vim);
            return;
          } else {
            // 2 different operators in a row doesn't make sense.
            clearInputState(cm);
          }
        }
        inputState.operator = command.operator;
        inputState.operatorArgs = copyArgs(command.operatorArgs);
        if (vim.visualMode) {
          // Operating on a selection in visual mode. We don't need a motion.
          this.evalInput(cm, vim);
        }
      },
      processOperatorMotion: function(cm, vim, command) {
        var visualMode = vim.visualMode;
        var operatorMotionArgs = copyArgs(command.operatorMotionArgs);
        if (operatorMotionArgs) {
          // Operator motions may have special behavior in visual mode.
          if (visualMode && operatorMotionArgs.visualLine) {
            vim.visualLine = true;
          }
        }
        this.processOperator(cm, vim, command);
        if (!visualMode) {
          this.processMotion(cm, vim, command);
        }
      },
      processAction: function(cm, vim, command) {
        var inputState = vim.inputState;
        var repeat = inputState.getRepeat();
        var repeatIsExplicit = !!repeat;
        var actionArgs = copyArgs(command.actionArgs) || {};
        if (inputState.selectedCharacter) {
          actionArgs.selectedCharacter = inputState.selectedCharacter;
        }
        // Actions may or may not have motions and operators. Do these first.
        if (command.operator) {
          this.processOperator(cm, vim, command);
        }
        if (command.motion) {
          this.processMotion(cm, vim, command);
        }
        if (command.motion || command.operator) {
          this.evalInput(cm, vim);
        }
        actionArgs.repeat = repeat || 1;
        actionArgs.repeatIsExplicit = repeatIsExplicit;
        actionArgs.registerName = inputState.registerName;
        clearInputState(cm);
        vim.lastMotion = null;
        if (command.isEdit) {
          this.recordLastEdit(vim, inputState, command);
        }
        actions[command.action](cm, actionArgs, vim);
      },
      processSearch: function(cm, vim, command) {
        if (!cm.getSearchCursor) {
          // Search depends on SearchCursor.
          return;
        }
        var forward = command.searchArgs.forward;
        var wholeWordOnly = command.searchArgs.wholeWordOnly;
        getSearchState(cm).setReversed(!forward);
        var promptPrefix = (forward) ? '/' : '?';
        var originalQuery = getSearchState(cm).getQuery();
        var originalScrollPos = cm.getScrollInfo();
        function handleQuery(query, ignoreCase, smartCase) {
          vimGlobalState.searchHistoryController.pushInput(query);
          vimGlobalState.searchHistoryController.reset();
          try {
            updateSearchQuery(cm, query, ignoreCase, smartCase);
          } catch (e) {
            showConfirm(cm, 'Invalid regex: ' + query);
            clearInputState(cm);
            return;
          }
          commandDispatcher.processMotion(cm, vim, {
            type: 'motion',
            motion: 'findNext',
            motionArgs: { forward: true, toJumplist: command.searchArgs.toJumplist }
          });
        }
        function onPromptClose(query) {
          cm.scrollTo(originalScrollPos.left, originalScrollPos.top);
          handleQuery(query, true /** ignoreCase */, true /** smartCase */);
          var macroModeState = vimGlobalState.macroModeState;
          if (macroModeState.isRecording) {
            logSearchQuery(macroModeState, query);
          }
        }
        function onPromptKeyUp(e, query, close) {
          var keyName = CodeMirror.keyName(e), up, offset;
          if (keyName == 'Up' || keyName == 'Down') {
            up = keyName == 'Up' ? true : false;
            offset = e.target ? e.target.selectionEnd : 0;
            query = vimGlobalState.searchHistoryController.nextMatch(query, up) || '';
            close(query);
            if (offset && e.target) e.target.selectionEnd = e.target.selectionStart = Math.min(offset, e.target.value.length);
          } else {
            if ( keyName != 'Left' && keyName != 'Right' && keyName != 'Ctrl' && keyName != 'Alt' && keyName != 'Shift')
              vimGlobalState.searchHistoryController.reset();
          }
          var parsedQuery;
          try {
            parsedQuery = updateSearchQuery(cm, query,
                true /** ignoreCase */, true /** smartCase */);
          } catch (e) {
            // Swallow bad regexes for incremental search.
          }
          if (parsedQuery) {
            cm.scrollIntoView(findNext(cm, !forward, parsedQuery), 30);
          } else {
            clearSearchHighlight(cm);
            cm.scrollTo(originalScrollPos.left, originalScrollPos.top);
          }
        }
        function onPromptKeyDown(e, query, close) {
          var keyName = CodeMirror.keyName(e);
          if (keyName == 'Esc' || keyName == 'Ctrl-C' || keyName == 'Ctrl-[' ||
              (keyName == 'Backspace' && query == '')) {
            vimGlobalState.searchHistoryController.pushInput(query);
            vimGlobalState.searchHistoryController.reset();
            updateSearchQuery(cm, originalQuery);
            clearSearchHighlight(cm);
            cm.scrollTo(originalScrollPos.left, originalScrollPos.top);
            CodeMirror.e_stop(e);
            clearInputState(cm);
            close();
            cm.focus();
          } else if (keyName == 'Up' || keyName == 'Down') {
            CodeMirror.e_stop(e);
          } else if (keyName == 'Ctrl-U') {
            // Ctrl-U clears input.
            CodeMirror.e_stop(e);
            close('');
          }
        }
        switch (command.searchArgs.querySrc) {
          case 'prompt':
            var macroModeState = vimGlobalState.macroModeState;
            if (macroModeState.isPlaying) {
              var query = macroModeState.replaySearchQueries.shift();
              handleQuery(query, true /** ignoreCase */, false /** smartCase */);
            } else {
              showPrompt(cm, {
                  onClose: onPromptClose,
                  prefix: promptPrefix,
                  desc: searchPromptDesc,
                  onKeyUp: onPromptKeyUp,
                  onKeyDown: onPromptKeyDown
              });
            }
            break;
          case 'wordUnderCursor':
            var word = expandWordUnderCursor(cm, false /** inclusive */,
                true /** forward */, false /** bigWord */,
                true /** noSymbol */);
            var isKeyword = true;
            if (!word) {
              word = expandWordUnderCursor(cm, false /** inclusive */,
                  true /** forward */, false /** bigWord */,
                  false /** noSymbol */);
              isKeyword = false;
            }
            if (!word) {
              return;
            }
            var query = cm.getLine(word.start.line).substring(word.start.ch,
                word.end.ch);
            if (isKeyword && wholeWordOnly) {
                query = '\\b' + query + '\\b';
            } else {
              query = escapeRegex(query);
            }

            // cachedCursor is used to save the old position of the cursor
            // when * or # causes vim to seek for the nearest word and shift
            // the cursor before entering the motion.
            vimGlobalState.jumpList.cachedCursor = cm.getCursor();
            cm.setCursor(word.start);

            handleQuery(query, true /** ignoreCase */, false /** smartCase */);
            break;
        }
      },
      processEx: function(cm, vim, command) {
        function onPromptClose(input) {
          // Give the prompt some time to close so that if processCommand shows
          // an error, the elements don't overlap.
          vimGlobalState.exCommandHistoryController.pushInput(input);
          vimGlobalState.exCommandHistoryController.reset();
          exCommandDispatcher.processCommand(cm, input);
        }
        function onPromptKeyDown(e, input, close) {
          var keyName = CodeMirror.keyName(e), up, offset;
          if (keyName == 'Esc' || keyName == 'Ctrl-C' || keyName == 'Ctrl-[' ||
              (keyName == 'Backspace' && input == '')) {
            vimGlobalState.exCommandHistoryController.pushInput(input);
            vimGlobalState.exCommandHistoryController.reset();
            CodeMirror.e_stop(e);
            clearInputState(cm);
            close();
            cm.focus();
          }
          if (keyName == 'Up' || keyName == 'Down') {
            CodeMirror.e_stop(e);
            up = keyName == 'Up' ? true : false;
            offset = e.target ? e.target.selectionEnd : 0;
            input = vimGlobalState.exCommandHistoryController.nextMatch(input, up) || '';
            close(input);
            if (offset && e.target) e.target.selectionEnd = e.target.selectionStart = Math.min(offset, e.target.value.length);
          } else if (keyName == 'Ctrl-U') {
            // Ctrl-U clears input.
            CodeMirror.e_stop(e);
            close('');
          } else {
            if ( keyName != 'Left' && keyName != 'Right' && keyName != 'Ctrl' && keyName != 'Alt' && keyName != 'Shift')
              vimGlobalState.exCommandHistoryController.reset();
          }
        }
        if (command.type == 'keyToEx') {
          // Handle user defined Ex to Ex mappings
          exCommandDispatcher.processCommand(cm, command.exArgs.input);
        } else {
          if (vim.visualMode) {
            showPrompt(cm, { onClose: onPromptClose, prefix: ':', value: '\'<,\'>',
                onKeyDown: onPromptKeyDown, selectValueOnOpen: false});
          } else {
            showPrompt(cm, { onClose: onPromptClose, prefix: ':',
                onKeyDown: onPromptKeyDown});
          }
        }
      },
      evalInput: function(cm, vim) {
        // If the motion command is set, execute both the operator and motion.
        // Otherwise return.
        var inputState = vim.inputState;
        var motion = inputState.motion;
        var motionArgs = inputState.motionArgs || {};
        var operator = inputState.operator;
        var operatorArgs = inputState.operatorArgs || {};
        var registerName = inputState.registerName;
        var sel = vim.sel;
        // TODO: Make sure cm and vim selections are identical outside visual mode.
        var origHead = copyCursor(vim.visualMode ? clipCursorToContent(cm, sel.head): cm.getCursor('head'));
        var origAnchor = copyCursor(vim.visualMode ? clipCursorToContent(cm, sel.anchor) : cm.getCursor('anchor'));
        var oldHead = copyCursor(origHead);
        var oldAnchor = copyCursor(origAnchor);
        var newHead, newAnchor;
        var repeat;
        if (operator) {
          this.recordLastEdit(vim, inputState);
        }
        if (inputState.repeatOverride !== undefined) {
          // If repeatOverride is specified, that takes precedence over the
          // input state's repeat. Used by Ex mode and can be user defined.
          repeat = inputState.repeatOverride;
        } else {
          repeat = inputState.getRepeat();
        }
        if (repeat > 0 && motionArgs.explicitRepeat) {
          motionArgs.repeatIsExplicit = true;
        } else if (motionArgs.noRepeat ||
            (!motionArgs.explicitRepeat && repeat === 0)) {
          repeat = 1;
          motionArgs.repeatIsExplicit = false;
        }
        if (inputState.selectedCharacter) {
          // If there is a character input, stick it in all of the arg arrays.
          motionArgs.selectedCharacter = operatorArgs.selectedCharacter =
              inputState.selectedCharacter;
        }
        motionArgs.repeat = repeat;
        clearInputState(cm);
        if (motion) {
          var motionResult = motions[motion](cm, origHead, motionArgs, vim);
          vim.lastMotion = motions[motion];
          if (!motionResult) {
            return;
          }
          if (motionArgs.toJumplist) {
            var jumpList = vimGlobalState.jumpList;
            // if the current motion is # or *, use cachedCursor
            var cachedCursor = jumpList.cachedCursor;
            if (cachedCursor) {
              recordJumpPosition(cm, cachedCursor, motionResult);
              delete jumpList.cachedCursor;
            } else {
              recordJumpPosition(cm, origHead, motionResult);
            }
          }
          if (motionResult instanceof Array) {
            newAnchor = motionResult[0];
            newHead = motionResult[1];
          } else {
            newHead = motionResult;
          }
          // TODO: Handle null returns from motion commands better.
          if (!newHead) {
            newHead = copyCursor(origHead);
          }
          if (vim.visualMode) {
            if (!(vim.visualBlock && newHead.ch === Infinity)) {
              newHead = clipCursorToContent(cm, newHead, vim.visualBlock);
            }
            if (newAnchor) {
              newAnchor = clipCursorToContent(cm, newAnchor, true);
            }
            newAnchor = newAnchor || oldAnchor;
            sel.anchor = newAnchor;
            sel.head = newHead;
            updateCmSelection(cm);
            updateMark(cm, vim, '<',
                cursorIsBefore(newAnchor, newHead) ? newAnchor
                    : newHead);
            updateMark(cm, vim, '>',
                cursorIsBefore(newAnchor, newHead) ? newHead
                    : newAnchor);
          } else if (!operator) {
            newHead = clipCursorToContent(cm, newHead);
            cm.setCursor(newHead.line, newHead.ch);
          }
        }
        if (operator) {
          if (operatorArgs.lastSel) {
            // Replaying a visual mode operation
            newAnchor = oldAnchor;
            var lastSel = operatorArgs.lastSel;
            var lineOffset = Math.abs(lastSel.head.line - lastSel.anchor.line);
            var chOffset = Math.abs(lastSel.head.ch - lastSel.anchor.ch);
            if (lastSel.visualLine) {
              // Linewise Visual mode: The same number of lines.
              newHead = Pos(oldAnchor.line + lineOffset, oldAnchor.ch);
            } else if (lastSel.visualBlock) {
              // Blockwise Visual mode: The same number of lines and columns.
              newHead = Pos(oldAnchor.line + lineOffset, oldAnchor.ch + chOffset);
            } else if (lastSel.head.line == lastSel.anchor.line) {
              // Normal Visual mode within one line: The same number of characters.
              newHead = Pos(oldAnchor.line, oldAnchor.ch + chOffset);
            } else {
              // Normal Visual mode with several lines: The same number of lines, in the
              // last line the same number of characters as in the last line the last time.
              newHead = Pos(oldAnchor.line + lineOffset, oldAnchor.ch);
            }
            vim.visualMode = true;
            vim.visualLine = lastSel.visualLine;
            vim.visualBlock = lastSel.visualBlock;
            sel = vim.sel = {
              anchor: newAnchor,
              head: newHead
            };
            updateCmSelection(cm);
          } else if (vim.visualMode) {
            operatorArgs.lastSel = {
              anchor: copyCursor(sel.anchor),
              head: copyCursor(sel.head),
              visualBlock: vim.visualBlock,
              visualLine: vim.visualLine
            };
          }
          var curStart, curEnd, linewise, mode;
          var cmSel;
          if (vim.visualMode) {
            // Init visual op
            curStart = cursorMin(sel.head, sel.anchor);
            curEnd = cursorMax(sel.head, sel.anchor);
            linewise = vim.visualLine || operatorArgs.linewise;
            mode = vim.visualBlock ? 'block' :
                   linewise ? 'line' :
                   'char';
            cmSel = makeCmSelection(cm, {
              anchor: curStart,
              head: curEnd
            }, mode);
            if (linewise) {
              var ranges = cmSel.ranges;
              if (mode == 'block') {
                // Linewise operators in visual block mode extend to end of line
                for (var i = 0; i < ranges.length; i++) {
                  ranges[i].head.ch = lineLength(cm, ranges[i].head.line);
                }
              } else if (mode == 'line') {
                ranges[0].head = Pos(ranges[0].head.line + 1, 0);
              }
            }
          } else {
            // Init motion op
            curStart = copyCursor(newAnchor || oldAnchor);
            curEnd = copyCursor(newHead || oldHead);
            if (cursorIsBefore(curEnd, curStart)) {
              var tmp = curStart;
              curStart = curEnd;
              curEnd = tmp;
            }
            linewise = motionArgs.linewise || operatorArgs.linewise;
            if (linewise) {
              // Expand selection to entire line.
              expandSelectionToLine(cm, curStart, curEnd);
            } else if (motionArgs.forward) {
              // Clip to trailing newlines only if the motion goes forward.
              clipToLine(cm, curStart, curEnd);
            }
            mode = 'char';
            var exclusive = !motionArgs.inclusive || linewise;
            cmSel = makeCmSelection(cm, {
              anchor: curStart,
              head: curEnd
            }, mode, exclusive);
          }
          cm.setSelections(cmSel.ranges, cmSel.primary);
          vim.lastMotion = null;
          operatorArgs.repeat = repeat; // For indent in visual mode.
          operatorArgs.registerName = registerName;
          // Keep track of linewise as it affects how paste and change behave.
          operatorArgs.linewise = linewise;
          var operatorMoveTo = operators[operator](
            cm, operatorArgs, cmSel.ranges, oldAnchor, newHead);
          if (vim.visualMode) {
            exitVisualMode(cm, operatorMoveTo != null);
          }
          if (operatorMoveTo) {
            cm.setCursor(operatorMoveTo);
          }
        }
      },
      recordLastEdit: function(vim, inputState, actionCommand) {
        var macroModeState = vimGlobalState.macroModeState;
        if (macroModeState.isPlaying) { return; }
        vim.lastEditInputState = inputState;
        vim.lastEditActionCommand = actionCommand;
        macroModeState.lastInsertModeChanges.changes = [];
        macroModeState.lastInsertModeChanges.expectCursorActivityForChange = false;
        macroModeState.lastInsertModeChanges.visualBlock = vim.visualBlock ? vim.sel.head.line - vim.sel.anchor.line : 0;
      }
    };

    /**
     * typedef {Object{line:number,ch:number}} Cursor An object containing the
     *     position of the cursor.
     */
    // All of the functions below return Cursor objects.
    var motions = {
      moveToTopLine: function(cm, _head, motionArgs) {
        var line = getUserVisibleLines(cm).top + motionArgs.repeat -1;
        return Pos(line, findFirstNonWhiteSpaceCharacter(cm.getLine(line)));
      },
      moveToMiddleLine: function(cm) {
        var range = getUserVisibleLines(cm);
        var line = Math.floor((range.top + range.bottom) * 0.5);
        return Pos(line, findFirstNonWhiteSpaceCharacter(cm.getLine(line)));
      },
      moveToBottomLine: function(cm, _head, motionArgs) {
        var line = getUserVisibleLines(cm).bottom - motionArgs.repeat +1;
        return Pos(line, findFirstNonWhiteSpaceCharacter(cm.getLine(line)));
      },
      expandToLine: function(_cm, head, motionArgs) {
        // Expands forward to end of line, and then to next line if repeat is
        // >1. Does not handle backward motion!
        var cur = head;
        return Pos(cur.line + motionArgs.repeat - 1, Infinity);
      },
      findNext: function(cm, _head, motionArgs) {
        var state = getSearchState(cm);
        var query = state.getQuery();
        if (!query) {
          return;
        }
        var prev = !motionArgs.forward;
        // If search is initiated with ? instead of /, negate direction.
        prev = (state.isReversed()) ? !prev : prev;
        highlightSearchMatches(cm, query);
        return findNext(cm, prev/** prev */, query, motionArgs.repeat);
      },
      goToMark: function(cm, _head, motionArgs, vim) {
        var pos = getMarkPos(cm, vim, motionArgs.selectedCharacter);
        if (pos) {
          return motionArgs.linewise ? { line: pos.line, ch: findFirstNonWhiteSpaceCharacter(cm.getLine(pos.line)) } : pos;
        }
        return null;
      },
      moveToOtherHighlightedEnd: function(cm, _head, motionArgs, vim) {
        if (vim.visualBlock && motionArgs.sameLine) {
          var sel = vim.sel;
          return [
            clipCursorToContent(cm, Pos(sel.anchor.line, sel.head.ch)),
            clipCursorToContent(cm, Pos(sel.head.line, sel.anchor.ch))
          ];
        } else {
          return ([vim.sel.head, vim.sel.anchor]);
        }
      },
      jumpToMark: function(cm, head, motionArgs, vim) {
        var best = head;
        for (var i = 0; i < motionArgs.repeat; i++) {
          var cursor = best;
          for (var key in vim.marks) {
            if (!isLowerCase(key)) {
              continue;
            }
            var mark = vim.marks[key].find();
            var isWrongDirection = (motionArgs.forward) ?
              cursorIsBefore(mark, cursor) : cursorIsBefore(cursor, mark);

            if (isWrongDirection) {
              continue;
            }
            if (motionArgs.linewise && (mark.line == cursor.line)) {
              continue;
            }

            var equal = cursorEqual(cursor, best);
            var between = (motionArgs.forward) ?
              cursorIsBetween(cursor, mark, best) :
              cursorIsBetween(best, mark, cursor);

            if (equal || between) {
              best = mark;
            }
          }
        }

        if (motionArgs.linewise) {
          // Vim places the cursor on the first non-whitespace character of
          // the line if there is one, else it places the cursor at the end
          // of the line, regardless of whether a mark was found.
          best = Pos(best.line, findFirstNonWhiteSpaceCharacter(cm.getLine(best.line)));
        }
        return best;
      },
      moveByCharacters: function(_cm, head, motionArgs) {
        var cur = head;
        var repeat = motionArgs.repeat;
        var ch = motionArgs.forward ? cur.ch + repeat : cur.ch - repeat;
        return Pos(cur.line, ch);
      },
      moveByLines: function(cm, head, motionArgs, vim) {
        var cur = head;
        var endCh = cur.ch;
        // Depending what our last motion was, we may want to do different
        // things. If our last motion was moving vertically, we want to
        // preserve the HPos from our last horizontal move.  If our last motion
        // was going to the end of a line, moving vertically we should go to
        // the end of the line, etc.
        switch (vim.lastMotion) {
          case this.moveByLines:
          case this.moveByDisplayLines:
          case this.moveByScroll:
          case this.moveToColumn:
          case this.moveToEol:
            endCh = vim.lastHPos;
            break;
          default:
            vim.lastHPos = endCh;
        }
        var repeat = motionArgs.repeat+(motionArgs.repeatOffset||0);
        var line = motionArgs.forward ? cur.line + repeat : cur.line - repeat;
        var first = cm.firstLine();
        var last = cm.lastLine();
        // Vim go to line begin or line end when cursor at first/last line and
        // move to previous/next line is triggered.
        if (line < first && cur.line == first){
          return this.moveToStartOfLine(cm, head, motionArgs, vim);
        }else if (line > last && cur.line == last){
            return this.moveToEol(cm, head, motionArgs, vim, true);
        }
        if (motionArgs.toFirstChar){
          endCh=findFirstNonWhiteSpaceCharacter(cm.getLine(line));
          vim.lastHPos = endCh;
        }
        vim.lastHSPos = cm.charCoords(Pos(line, endCh),'div').left;
        return Pos(line, endCh);
      },
      moveByDisplayLines: function(cm, head, motionArgs, vim) {
        var cur = head;
        switch (vim.lastMotion) {
          case this.moveByDisplayLines:
          case this.moveByScroll:
          case this.moveByLines:
          case this.moveToColumn:
          case this.moveToEol:
            break;
          default:
            vim.lastHSPos = cm.charCoords(cur,'div').left;
        }
        var repeat = motionArgs.repeat;
        var res=cm.findPosV(cur,(motionArgs.forward ? repeat : -repeat),'line',vim.lastHSPos);
        if (res.hitSide) {
          if (motionArgs.forward) {
            var lastCharCoords = cm.charCoords(res, 'div');
            var goalCoords = { top: lastCharCoords.top + 8, left: vim.lastHSPos };
            var res = cm.coordsChar(goalCoords, 'div');
          } else {
            var resCoords = cm.charCoords(Pos(cm.firstLine(), 0), 'div');
            resCoords.left = vim.lastHSPos;
            res = cm.coordsChar(resCoords, 'div');
          }
        }
        vim.lastHPos = res.ch;
        return res;
      },
      moveByPage: function(cm, head, motionArgs) {
        // CodeMirror only exposes functions that move the cursor page down, so
        // doing this bad hack to move the cursor and move it back. evalInput
        // will move the cursor to where it should be in the end.
        var curStart = head;
        var repeat = motionArgs.repeat;
        return cm.findPosV(curStart, (motionArgs.forward ? repeat : -repeat), 'page');
      },
      moveByParagraph: function(cm, head, motionArgs) {
        var dir = motionArgs.forward ? 1 : -1;
        return findParagraph(cm, head, motionArgs.repeat, dir);
      },
      moveBySentence: function(cm, head, motionArgs) {
        var dir = motionArgs.forward ? 1 : -1;
        return findSentence(cm, head, motionArgs.repeat, dir);
      },
      moveByScroll: function(cm, head, motionArgs, vim) {
        var scrollbox = cm.getScrollInfo();
        var curEnd = null;
        var repeat = motionArgs.repeat;
        if (!repeat) {
          repeat = scrollbox.clientHeight / (2 * cm.defaultTextHeight());
        }
        var orig = cm.charCoords(head, 'local');
        motionArgs.repeat = repeat;
        var curEnd = motions.moveByDisplayLines(cm, head, motionArgs, vim);
        if (!curEnd) {
          return null;
        }
        var dest = cm.charCoords(curEnd, 'local');
        cm.scrollTo(null, scrollbox.top + dest.top - orig.top);
        return curEnd;
      },
      moveByWords: function(cm, head, motionArgs) {
        return moveToWord(cm, head, motionArgs.repeat, !!motionArgs.forward,
            !!motionArgs.wordEnd, !!motionArgs.bigWord);
      },
      moveTillCharacter: function(cm, _head, motionArgs) {
        var repeat = motionArgs.repeat;
        var curEnd = moveToCharacter(cm, repeat, motionArgs.forward,
            motionArgs.selectedCharacter);
        var increment = motionArgs.forward ? -1 : 1;
        recordLastCharacterSearch(increment, motionArgs);
        if (!curEnd) return null;
        curEnd.ch += increment;
        return curEnd;
      },
      moveToCharacter: function(cm, head, motionArgs) {
        var repeat = motionArgs.repeat;
        recordLastCharacterSearch(0, motionArgs);
        return moveToCharacter(cm, repeat, motionArgs.forward,
            motionArgs.selectedCharacter) || head;
      },
      moveToSymbol: function(cm, head, motionArgs) {
        var repeat = motionArgs.repeat;
        return findSymbol(cm, repeat, motionArgs.forward,
            motionArgs.selectedCharacter) || head;
      },
      moveToColumn: function(cm, head, motionArgs, vim) {
        var repeat = motionArgs.repeat;
        // repeat is equivalent to which column we want to move to!
        vim.lastHPos = repeat - 1;
        vim.lastHSPos = cm.charCoords(head,'div').left;
        return moveToColumn(cm, repeat);
      },
      moveToEol: function(cm, head, motionArgs, vim, keepHPos) {
        var cur = head;
        var retval= Pos(cur.line + motionArgs.repeat - 1, Infinity);
        var end=cm.clipPos(retval);
        end.ch--;
        if (!keepHPos) {
          vim.lastHPos = Infinity;
          vim.lastHSPos = cm.charCoords(end,'div').left;
        }
        return retval;
      },
      moveToFirstNonWhiteSpaceCharacter: function(cm, head) {
        // Go to the start of the line where the text begins, or the end for
        // whitespace-only lines
        var cursor = head;
        return Pos(cursor.line,
                   findFirstNonWhiteSpaceCharacter(cm.getLine(cursor.line)));
      },
      moveToMatchedSymbol: function(cm, head) {
        var cursor = head;
        var line = cursor.line;
        var ch = cursor.ch;
        var lineText = cm.getLine(line);
        var symbol;
        for (; ch < lineText.length; ch++) {
          symbol = lineText.charAt(ch);
          if (symbol && isMatchableSymbol(symbol)) {
            var style = cm.getTokenTypeAt(Pos(line, ch + 1));
            if (style !== "string" && style !== "comment") {
              break;
            }
          }
        }
        if (ch < lineText.length) {
          // Only include angle brackets in analysis if they are being matched.
          var re = (ch === '<' || ch === '>') ? /[(){}[\]<>]/ : /[(){}[\]]/;
          var matched = cm.findMatchingBracket(Pos(line, ch), {bracketRegex: re});
          return matched.to;
        } else {
          return cursor;
        }
      },
      moveToStartOfLine: function(_cm, head) {
        return Pos(head.line, 0);
      },
      moveToLineOrEdgeOfDocument: function(cm, _head, motionArgs) {
        var lineNum = motionArgs.forward ? cm.lastLine() : cm.firstLine();
        if (motionArgs.repeatIsExplicit) {
          lineNum = motionArgs.repeat - cm.getOption('firstLineNumber');
        }
        return Pos(lineNum,
                   findFirstNonWhiteSpaceCharacter(cm.getLine(lineNum)));
      },
      textObjectManipulation: function(cm, head, motionArgs, vim) {
        // TODO: lots of possible exceptions that can be thrown here. Try da(
        //     outside of a () block.
        var mirroredPairs = {'(': ')', ')': '(',
                             '{': '}', '}': '{',
                             '[': ']', ']': '[',
                             '<': '>', '>': '<'};
        var selfPaired = {'\'': true, '"': true, '`': true};

        var character = motionArgs.selectedCharacter;
        // 'b' refers to  '()' block.
        // 'B' refers to  '{}' block.
        if (character == 'b') {
          character = '(';
        } else if (character == 'B') {
          character = '{';
        }

        // Inclusive is the difference between a and i
        // TODO: Instead of using the additional text object map to perform text
        //     object operations, merge the map into the defaultKeyMap and use
        //     motionArgs to define behavior. Define separate entries for 'aw',
        //     'iw', 'a[', 'i[', etc.
        var inclusive = !motionArgs.textObjectInner;

        var tmp;
        if (mirroredPairs[character]) {
          tmp = selectCompanionObject(cm, head, character, inclusive);
        } else if (selfPaired[character]) {
          tmp = findBeginningAndEnd(cm, head, character, inclusive);
        } else if (character === 'W') {
          tmp = expandWordUnderCursor(cm, inclusive, true /** forward */,
                                                     true /** bigWord */);
        } else if (character === 'w') {
          tmp = expandWordUnderCursor(cm, inclusive, true /** forward */,
                                                     false /** bigWord */);
        } else if (character === 'p') {
          tmp = findParagraph(cm, head, motionArgs.repeat, 0, inclusive);
          motionArgs.linewise = true;
          if (vim.visualMode) {
            if (!vim.visualLine) { vim.visualLine = true; }
          } else {
            var operatorArgs = vim.inputState.operatorArgs;
            if (operatorArgs) { operatorArgs.linewise = true; }
            tmp.end.line--;
          }
        } else {
          // No text object defined for this, don't move.
          return null;
        }

        if (!cm.state.vim.visualMode) {
          return [tmp.start, tmp.end];
        } else {
          return expandSelection(cm, tmp.start, tmp.end);
        }
      },

      repeatLastCharacterSearch: function(cm, head, motionArgs) {
        var lastSearch = vimGlobalState.lastCharacterSearch;
        var repeat = motionArgs.repeat;
        var forward = motionArgs.forward === lastSearch.forward;
        var increment = (lastSearch.increment ? 1 : 0) * (forward ? -1 : 1);
        cm.moveH(-increment, 'char');
        motionArgs.inclusive = forward ? true : false;
        var curEnd = moveToCharacter(cm, repeat, forward, lastSearch.selectedCharacter);
        if (!curEnd) {
          cm.moveH(increment, 'char');
          return head;
        }
        curEnd.ch += increment;
        return curEnd;
      }
    };

    function defineMotion(name, fn) {
      motions[name] = fn;
    }

    function fillArray(val, times) {
      var arr = [];
      for (var i = 0; i < times; i++) {
        arr.push(val);
      }
      return arr;
    }
    /**
     * An operator acts on a text selection. It receives the list of selections
     * as input. The corresponding CodeMirror selection is guaranteed to
    * match the input selection.
     */
    var operators = {
      change: function(cm, args, ranges) {
        var finalHead, text;
        var vim = cm.state.vim;
        if (!vim.visualMode) {
          var anchor = ranges[0].anchor,
              head = ranges[0].head;
          text = cm.getRange(anchor, head);
          var lastState = vim.lastEditInputState || {};
          if (lastState.motion == "moveByWords" && !isWhiteSpaceString(text)) {
            // Exclude trailing whitespace if the range is not all whitespace.
            var match = (/\s+$/).exec(text);
            if (match && lastState.motionArgs && lastState.motionArgs.forward) {
              head = offsetCursor(head, 0, - match[0].length);
              text = text.slice(0, - match[0].length);
            }
          }
          var prevLineEnd = new Pos(anchor.line - 1, Number.MAX_VALUE);
          var wasLastLine = cm.firstLine() == cm.lastLine();
          if (head.line > cm.lastLine() && args.linewise && !wasLastLine) {
            cm.replaceRange('', prevLineEnd, head);
          } else {
            cm.replaceRange('', anchor, head);
          }
          if (args.linewise) {
            // Push the next line back down, if there is a next line.
            if (!wasLastLine) {
              cm.setCursor(prevLineEnd);
              CodeMirror.commands.newlineAndIndent(cm);
            }
            // make sure cursor ends up at the end of the line.
            anchor.ch = Number.MAX_VALUE;
          }
          finalHead = anchor;
        } else {
          text = cm.getSelection();
          var replacement = fillArray('', ranges.length);
          cm.replaceSelections(replacement);
          finalHead = cursorMin(ranges[0].head, ranges[0].anchor);
        }
        vimGlobalState.registerController.pushText(
            args.registerName, 'change', text,
            args.linewise, ranges.length > 1);
        actions.enterInsertMode(cm, {head: finalHead}, cm.state.vim);
      },
      // delete is a javascript keyword.
      'delete': function(cm, args, ranges) {
        var finalHead, text;
        var vim = cm.state.vim;
        if (!vim.visualBlock) {
          var anchor = ranges[0].anchor,
              head = ranges[0].head;
          if (args.linewise &&
              head.line != cm.firstLine() &&
              anchor.line == cm.lastLine() &&
              anchor.line == head.line - 1) {
            // Special case for dd on last line (and first line).
            if (anchor.line == cm.firstLine()) {
              anchor.ch = 0;
            } else {
              anchor = Pos(anchor.line - 1, lineLength(cm, anchor.line - 1));
            }
          }
          text = cm.getRange(anchor, head);
          cm.replaceRange('', anchor, head);
          finalHead = anchor;
          if (args.linewise) {
            finalHead = motions.moveToFirstNonWhiteSpaceCharacter(cm, anchor);
          }
        } else {
          text = cm.getSelection();
          var replacement = fillArray('', ranges.length);
          cm.replaceSelections(replacement);
          finalHead = ranges[0].anchor;
        }
        vimGlobalState.registerController.pushText(
            args.registerName, 'delete', text,
            args.linewise, vim.visualBlock);
        var includeLineBreak = vim.insertMode
        return clipCursorToContent(cm, finalHead, includeLineBreak);
      },
      indent: function(cm, args, ranges) {
        var vim = cm.state.vim;
        var startLine = ranges[0].anchor.line;
        var endLine = vim.visualBlock ?
          ranges[ranges.length - 1].anchor.line :
          ranges[0].head.line;
        // In visual mode, n> shifts the selection right n times, instead of
        // shifting n lines right once.
        var repeat = (vim.visualMode) ? args.repeat : 1;
        if (args.linewise) {
          // The only way to delete a newline is to delete until the start of
          // the next line, so in linewise mode evalInput will include the next
          // line. We don't want this in indent, so we go back a line.
          endLine--;
        }
        for (var i = startLine; i <= endLine; i++) {
          for (var j = 0; j < repeat; j++) {
            cm.indentLine(i, args.indentRight);
          }
        }
        return motions.moveToFirstNonWhiteSpaceCharacter(cm, ranges[0].anchor);
      },
      indentAuto: function(cm, _args, ranges) {
        cm.execCommand("indentAuto");
        return motions.moveToFirstNonWhiteSpaceCharacter(cm, ranges[0].anchor);
      },
      changeCase: function(cm, args, ranges, oldAnchor, newHead) {
        var selections = cm.getSelections();
        var swapped = [];
        var toLower = args.toLower;
        for (var j = 0; j < selections.length; j++) {
          var toSwap = selections[j];
          var text = '';
          if (toLower === true) {
            text = toSwap.toLowerCase();
          } else if (toLower === false) {
            text = toSwap.toUpperCase();
          } else {
            for (var i = 0; i < toSwap.length; i++) {
              var character = toSwap.charAt(i);
              text += isUpperCase(character) ? character.toLowerCase() :
                  character.toUpperCase();
            }
          }
          swapped.push(text);
        }
        cm.replaceSelections(swapped);
        if (args.shouldMoveCursor){
          return newHead;
        } else if (!cm.state.vim.visualMode && args.linewise && ranges[0].anchor.line + 1 == ranges[0].head.line) {
          return motions.moveToFirstNonWhiteSpaceCharacter(cm, oldAnchor);
        } else if (args.linewise){
          return oldAnchor;
        } else {
          return cursorMin(ranges[0].anchor, ranges[0].head);
        }
      },
      yank: function(cm, args, ranges, oldAnchor) {
        var vim = cm.state.vim;
        var text = cm.getSelection();
        var endPos = vim.visualMode
          ? cursorMin(vim.sel.anchor, vim.sel.head, ranges[0].head, ranges[0].anchor)
          : oldAnchor;
        vimGlobalState.registerController.pushText(
            args.registerName, 'yank',
            text, args.linewise, vim.visualBlock);
        return endPos;
      }
    };

    function defineOperator(name, fn) {
      operators[name] = fn;
    }

    var actions = {
      jumpListWalk: function(cm, actionArgs, vim) {
        if (vim.visualMode) {
          return;
        }
        var repeat = actionArgs.repeat;
        var forward = actionArgs.forward;
        var jumpList = vimGlobalState.jumpList;

        var mark = jumpList.move(cm, forward ? repeat : -repeat);
        var markPos = mark ? mark.find() : undefined;
        markPos = markPos ? markPos : cm.getCursor();
        cm.setCursor(markPos);
      },
      scroll: function(cm, actionArgs, vim) {
        if (vim.visualMode) {
          return;
        }
        var repeat = actionArgs.repeat || 1;
        var lineHeight = cm.defaultTextHeight();
        var top = cm.getScrollInfo().top;
        var delta = lineHeight * repeat;
        var newPos = actionArgs.forward ? top + delta : top - delta;
        var cursor = copyCursor(cm.getCursor());
        var cursorCoords = cm.charCoords(cursor, 'local');
        if (actionArgs.forward) {
          if (newPos > cursorCoords.top) {
             cursor.line += (newPos - cursorCoords.top) / lineHeight;
             cursor.line = Math.ceil(cursor.line);
             cm.setCursor(cursor);
             cursorCoords = cm.charCoords(cursor, 'local');
             cm.scrollTo(null, cursorCoords.top);
          } else {
             // Cursor stays within bounds.  Just reposition the scroll window.
             cm.scrollTo(null, newPos);
          }
        } else {
          var newBottom = newPos + cm.getScrollInfo().clientHeight;
          if (newBottom < cursorCoords.bottom) {
             cursor.line -= (cursorCoords.bottom - newBottom) / lineHeight;
             cursor.line = Math.floor(cursor.line);
             cm.setCursor(cursor);
             cursorCoords = cm.charCoords(cursor, 'local');
             cm.scrollTo(
                 null, cursorCoords.bottom - cm.getScrollInfo().clientHeight);
          } else {
             // Cursor stays within bounds.  Just reposition the scroll window.
             cm.scrollTo(null, newPos);
          }
        }
      },
      scrollToCursor: function(cm, actionArgs) {
        var lineNum = cm.getCursor().line;
        var charCoords = cm.charCoords(Pos(lineNum, 0), 'local');
        var height = cm.getScrollInfo().clientHeight;
        var y = charCoords.top;
        var lineHeight = charCoords.bottom - y;
        switch (actionArgs.position) {
          case 'center': y = y - (height / 2) + lineHeight;
            break;
          case 'bottom': y = y - height + lineHeight;
            break;
        }
        cm.scrollTo(null, y);
      },
      replayMacro: function(cm, actionArgs, vim) {
        var registerName = actionArgs.selectedCharacter;
        var repeat = actionArgs.repeat;
        var macroModeState = vimGlobalState.macroModeState;
        if (registerName == '@') {
          registerName = macroModeState.latestRegister;
        } else {
          macroModeState.latestRegister = registerName;
        }
        while(repeat--){
          executeMacroRegister(cm, vim, macroModeState, registerName);
        }
      },
      enterMacroRecordMode: function(cm, actionArgs) {
        var macroModeState = vimGlobalState.macroModeState;
        var registerName = actionArgs.selectedCharacter;
        if (vimGlobalState.registerController.isValidRegister(registerName)) {
          macroModeState.enterMacroRecordMode(cm, registerName);
        }
      },
      toggleOverwrite: function(cm) {
        if (!cm.state.overwrite) {
          cm.toggleOverwrite(true);
          cm.setOption('keyMap', 'vim-replace');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "replace"});
        } else {
          cm.toggleOverwrite(false);
          cm.setOption('keyMap', 'vim-insert');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "insert"});
        }
      },
      enterInsertMode: function(cm, actionArgs, vim) {
        if (cm.getOption('readOnly')) { return; }
        vim.insertMode = true;
        vim.insertModeRepeat = actionArgs && actionArgs.repeat || 1;
        var insertAt = (actionArgs) ? actionArgs.insertAt : null;
        var sel = vim.sel;
        var head = actionArgs.head || cm.getCursor('head');
        var height = cm.listSelections().length;
        if (insertAt == 'eol') {
          head = Pos(head.line, lineLength(cm, head.line));
        } else if (insertAt == 'charAfter') {
          head = offsetCursor(head, 0, 1);
        } else if (insertAt == 'firstNonBlank') {
          head = motions.moveToFirstNonWhiteSpaceCharacter(cm, head);
        } else if (insertAt == 'startOfSelectedArea') {
          if (!vim.visualMode)
              return;
          if (!vim.visualBlock) {
            if (sel.head.line < sel.anchor.line) {
              head = sel.head;
            } else {
              head = Pos(sel.anchor.line, 0);
            }
          } else {
            head = Pos(
                Math.min(sel.head.line, sel.anchor.line),
                Math.min(sel.head.ch, sel.anchor.ch));
            height = Math.abs(sel.head.line - sel.anchor.line) + 1;
          }
        } else if (insertAt == 'endOfSelectedArea') {
            if (!vim.visualMode)
              return;
          if (!vim.visualBlock) {
            if (sel.head.line >= sel.anchor.line) {
              head = offsetCursor(sel.head, 0, 1);
            } else {
              head = Pos(sel.anchor.line, 0);
            }
          } else {
            head = Pos(
                Math.min(sel.head.line, sel.anchor.line),
                Math.max(sel.head.ch + 1, sel.anchor.ch));
            height = Math.abs(sel.head.line - sel.anchor.line) + 1;
          }
        } else if (insertAt == 'inplace') {
          if (vim.visualMode){
            return;
          }
        }
        cm.setOption('disableInput', false);
        if (actionArgs && actionArgs.replace) {
          // Handle Replace-mode as a special case of insert mode.
          cm.toggleOverwrite(true);
          cm.setOption('keyMap', 'vim-replace');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "replace"});
        } else {
          cm.toggleOverwrite(false);
          cm.setOption('keyMap', 'vim-insert');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "insert"});
        }
        if (!vimGlobalState.macroModeState.isPlaying) {
          // Only record if not replaying.
          cm.on('change', onChange);
          CodeMirror.on(cm.getInputField(), 'keydown', onKeyEventTargetKeyDown);
        }
        if (vim.visualMode) {
          exitVisualMode(cm);
        }
        selectForInsert(cm, head, height);
      },
      toggleVisualMode: function(cm, actionArgs, vim) {
        var repeat = actionArgs.repeat;
        var anchor = cm.getCursor();
        var head;
        // TODO: The repeat should actually select number of characters/lines
        //     equal to the repeat times the size of the previous visual
        //     operation.
        if (!vim.visualMode) {
          // Entering visual mode
          vim.visualMode = true;
          vim.visualLine = !!actionArgs.linewise;
          vim.visualBlock = !!actionArgs.blockwise;
          head = clipCursorToContent(
              cm, Pos(anchor.line, anchor.ch + repeat - 1),
              true /** includeLineBreak */);
          vim.sel = {
            anchor: anchor,
            head: head
          };
          CodeMirror.signal(cm, "vim-mode-change", {mode: "visual", subMode: vim.visualLine ? "linewise" : vim.visualBlock ? "blockwise" : ""});
          updateCmSelection(cm);
          updateMark(cm, vim, '<', cursorMin(anchor, head));
          updateMark(cm, vim, '>', cursorMax(anchor, head));
        } else if (vim.visualLine ^ actionArgs.linewise ||
            vim.visualBlock ^ actionArgs.blockwise) {
          // Toggling between modes
          vim.visualLine = !!actionArgs.linewise;
          vim.visualBlock = !!actionArgs.blockwise;
          CodeMirror.signal(cm, "vim-mode-change", {mode: "visual", subMode: vim.visualLine ? "linewise" : vim.visualBlock ? "blockwise" : ""});
          updateCmSelection(cm);
        } else {
          exitVisualMode(cm);
        }
      },
      reselectLastSelection: function(cm, _actionArgs, vim) {
        var lastSelection = vim.lastSelection;
        if (vim.visualMode) {
          updateLastSelection(cm, vim);
        }
        if (lastSelection) {
          var anchor = lastSelection.anchorMark.find();
          var head = lastSelection.headMark.find();
          if (!anchor || !head) {
            // If the marks have been destroyed due to edits, do nothing.
            return;
          }
          vim.sel = {
            anchor: anchor,
            head: head
          };
          vim.visualMode = true;
          vim.visualLine = lastSelection.visualLine;
          vim.visualBlock = lastSelection.visualBlock;
          updateCmSelection(cm);
          updateMark(cm, vim, '<', cursorMin(anchor, head));
          updateMark(cm, vim, '>', cursorMax(anchor, head));
          CodeMirror.signal(cm, 'vim-mode-change', {
            mode: 'visual',
            subMode: vim.visualLine ? 'linewise' :
                     vim.visualBlock ? 'blockwise' : ''});
        }
      },
      joinLines: function(cm, actionArgs, vim) {
        var curStart, curEnd;
        if (vim.visualMode) {
          curStart = cm.getCursor('anchor');
          curEnd = cm.getCursor('head');
          if (cursorIsBefore(curEnd, curStart)) {
            var tmp = curEnd;
            curEnd = curStart;
            curStart = tmp;
          }
          curEnd.ch = lineLength(cm, curEnd.line) - 1;
        } else {
          // Repeat is the number of lines to join. Minimum 2 lines.
          var repeat = Math.max(actionArgs.repeat, 2);
          curStart = cm.getCursor();
          curEnd = clipCursorToContent(cm, Pos(curStart.line + repeat - 1,
                                               Infinity));
        }
        var finalCh = 0;
        for (var i = curStart.line; i < curEnd.line; i++) {
          finalCh = lineLength(cm, curStart.line);
          var tmp = Pos(curStart.line + 1,
                        lineLength(cm, curStart.line + 1));
          var text = cm.getRange(curStart, tmp);
          text = text.replace(/\n\s*/g, ' ');
          cm.replaceRange(text, curStart, tmp);
        }
        var curFinalPos = Pos(curStart.line, finalCh);
        if (vim.visualMode) {
          exitVisualMode(cm, false);
        }
        cm.setCursor(curFinalPos);
      },
      newLineAndEnterInsertMode: function(cm, actionArgs, vim) {
        vim.insertMode = true;
        var insertAt = copyCursor(cm.getCursor());
        if (insertAt.line === cm.firstLine() && !actionArgs.after) {
          // Special case for inserting newline before start of document.
          cm.replaceRange('\n', Pos(cm.firstLine(), 0));
          cm.setCursor(cm.firstLine(), 0);
        } else {
          insertAt.line = (actionArgs.after) ? insertAt.line :
              insertAt.line - 1;
          insertAt.ch = lineLength(cm, insertAt.line);
          cm.setCursor(insertAt);
          var newlineFn = CodeMirror.commands.newlineAndIndentContinueComment ||
              CodeMirror.commands.newlineAndIndent;
          newlineFn(cm);
        }
        this.enterInsertMode(cm, { repeat: actionArgs.repeat }, vim);
      },
      paste: function(cm, actionArgs, vim) {
        var cur = copyCursor(cm.getCursor());
        var register = vimGlobalState.registerController.getRegister(
            actionArgs.registerName);
        var text = register.toString();
        if (!text) {
          return;
        }
        if (actionArgs.matchIndent) {
          var tabSize = cm.getOption("tabSize");
          // length that considers tabs and tabSize
          var whitespaceLength = function(str) {
            var tabs = (str.split("\t").length - 1);
            var spaces = (str.split(" ").length - 1);
            return tabs * tabSize + spaces * 1;
          };
          var currentLine = cm.getLine(cm.getCursor().line);
          var indent = whitespaceLength(currentLine.match(/^\s*/)[0]);
          // chomp last newline b/c don't want it to match /^\s*/gm
          var chompedText = text.replace(/\n$/, '');
          var wasChomped = text !== chompedText;
          var firstIndent = whitespaceLength(text.match(/^\s*/)[0]);
          var text = chompedText.replace(/^\s*/gm, function(wspace) {
            var newIndent = indent + (whitespaceLength(wspace) - firstIndent);
            if (newIndent < 0) {
              return "";
            }
            else if (cm.getOption("indentWithTabs")) {
              var quotient = Math.floor(newIndent / tabSize);
              return Array(quotient + 1).join('\t');
            }
            else {
              return Array(newIndent + 1).join(' ');
            }
          });
          text += wasChomped ? "\n" : "";
        }
        if (actionArgs.repeat > 1) {
          var text = Array(actionArgs.repeat + 1).join(text);
        }
        var linewise = register.linewise;
        var blockwise = register.blockwise;
        if (blockwise) {
          text = text.split('\n');
          if (linewise) {
              text.pop();
          }
          for (var i = 0; i < text.length; i++) {
            text[i] = (text[i] == '') ? ' ' : text[i];
          }
          cur.ch += actionArgs.after ? 1 : 0;
          cur.ch = Math.min(lineLength(cm, cur.line), cur.ch);
        } else if (linewise) {
          if(vim.visualMode) {
            text = vim.visualLine ? text.slice(0, -1) : '\n' + text.slice(0, text.length - 1) + '\n';
          } else if (actionArgs.after) {
            // Move the newline at the end to the start instead, and paste just
            // before the newline character of the line we are on right now.
            text = '\n' + text.slice(0, text.length - 1);
            cur.ch = lineLength(cm, cur.line);
          } else {
            cur.ch = 0;
          }
        } else {
          cur.ch += actionArgs.after ? 1 : 0;
        }
        var curPosFinal;
        var idx;
        if (vim.visualMode) {
          //  save the pasted text for reselection if the need arises
          vim.lastPastedText = text;
          var lastSelectionCurEnd;
          var selectedArea = getSelectedAreaRange(cm, vim);
          var selectionStart = selectedArea[0];
          var selectionEnd = selectedArea[1];
          var selectedText = cm.getSelection();
          var selections = cm.listSelections();
          var emptyStrings = new Array(selections.length).join('1').split('1');
          // save the curEnd marker before it get cleared due to cm.replaceRange.
          if (vim.lastSelection) {
            lastSelectionCurEnd = vim.lastSelection.headMark.find();
          }
          // push the previously selected text to unnamed register
          vimGlobalState.registerController.unnamedRegister.setText(selectedText);
          if (blockwise) {
            // first delete the selected text
            cm.replaceSelections(emptyStrings);
            // Set new selections as per the block length of the yanked text
            selectionEnd = Pos(selectionStart.line + text.length-1, selectionStart.ch);
            cm.setCursor(selectionStart);
            selectBlock(cm, selectionEnd);
            cm.replaceSelections(text);
            curPosFinal = selectionStart;
          } else if (vim.visualBlock) {
            cm.replaceSelections(emptyStrings);
            cm.setCursor(selectionStart);
            cm.replaceRange(text, selectionStart, selectionStart);
            curPosFinal = selectionStart;
          } else {
            cm.replaceRange(text, selectionStart, selectionEnd);
            curPosFinal = cm.posFromIndex(cm.indexFromPos(selectionStart) + text.length - 1);
          }
          // restore the the curEnd marker
          if(lastSelectionCurEnd) {
            vim.lastSelection.headMark = cm.setBookmark(lastSelectionCurEnd);
          }
          if (linewise) {
            curPosFinal.ch=0;
          }
        } else {
          if (blockwise) {
            cm.setCursor(cur);
            for (var i = 0; i < text.length; i++) {
              var line = cur.line+i;
              if (line > cm.lastLine()) {
                cm.replaceRange('\n',  Pos(line, 0));
              }
              var lastCh = lineLength(cm, line);
              if (lastCh < cur.ch) {
                extendLineToColumn(cm, line, cur.ch);
              }
            }
            cm.setCursor(cur);
            selectBlock(cm, Pos(cur.line + text.length-1, cur.ch));
            cm.replaceSelections(text);
            curPosFinal = cur;
          } else {
            cm.replaceRange(text, cur);
            // Now fine tune the cursor to where we want it.
            if (linewise && actionArgs.after) {
              curPosFinal = Pos(
              cur.line + 1,
              findFirstNonWhiteSpaceCharacter(cm.getLine(cur.line + 1)));
            } else if (linewise && !actionArgs.after) {
              curPosFinal = Pos(
                cur.line,
                findFirstNonWhiteSpaceCharacter(cm.getLine(cur.line)));
            } else if (!linewise && actionArgs.after) {
              idx = cm.indexFromPos(cur);
              curPosFinal = cm.posFromIndex(idx + text.length - 1);
            } else {
              idx = cm.indexFromPos(cur);
              curPosFinal = cm.posFromIndex(idx + text.length);
            }
          }
        }
        if (vim.visualMode) {
          exitVisualMode(cm, false);
        }
        cm.setCursor(curPosFinal);
      },
      undo: function(cm, actionArgs) {
        cm.operation(function() {
          repeatFn(cm, CodeMirror.commands.undo, actionArgs.repeat)();
          cm.setCursor(cm.getCursor('anchor'));
        });
      },
      redo: function(cm, actionArgs) {
        repeatFn(cm, CodeMirror.commands.redo, actionArgs.repeat)();
      },
      setRegister: function(_cm, actionArgs, vim) {
        vim.inputState.registerName = actionArgs.selectedCharacter;
      },
      setMark: function(cm, actionArgs, vim) {
        var markName = actionArgs.selectedCharacter;
        updateMark(cm, vim, markName, cm.getCursor());
      },
      replace: function(cm, actionArgs, vim) {
        var replaceWith = actionArgs.selectedCharacter;
        var curStart = cm.getCursor();
        var replaceTo;
        var curEnd;
        var selections = cm.listSelections();
        if (vim.visualMode) {
          curStart = cm.getCursor('start');
          curEnd = cm.getCursor('end');
        } else {
          var line = cm.getLine(curStart.line);
          replaceTo = curStart.ch + actionArgs.repeat;
          if (replaceTo > line.length) {
            replaceTo=line.length;
          }
          curEnd = Pos(curStart.line, replaceTo);
        }
        if (replaceWith=='\n') {
          if (!vim.visualMode) cm.replaceRange('', curStart, curEnd);
          // special case, where vim help says to replace by just one line-break
          (CodeMirror.commands.newlineAndIndentContinueComment || CodeMirror.commands.newlineAndIndent)(cm);
        } else {
          var replaceWithStr = cm.getRange(curStart, curEnd);
          //replace all characters in range by selected, but keep linebreaks
          replaceWithStr = replaceWithStr.replace(/[^\n]/g, replaceWith);
          if (vim.visualBlock) {
            // Tabs are split in visua block before replacing
            var spaces = new Array(cm.getOption("tabSize")+1).join(' ');
            replaceWithStr = cm.getSelection();
            replaceWithStr = replaceWithStr.replace(/\t/g, spaces).replace(/[^\n]/g, replaceWith).split('\n');
            cm.replaceSelections(replaceWithStr);
          } else {
            cm.replaceRange(replaceWithStr, curStart, curEnd);
          }
          if (vim.visualMode) {
            curStart = cursorIsBefore(selections[0].anchor, selections[0].head) ?
                         selections[0].anchor : selections[0].head;
            cm.setCursor(curStart);
            exitVisualMode(cm, false);
          } else {
            cm.setCursor(offsetCursor(curEnd, 0, -1));
          }
        }
      },
      incrementNumberToken: function(cm, actionArgs) {
        var cur = cm.getCursor();
        var lineStr = cm.getLine(cur.line);
        var re = /(-?)(?:(0x)([\da-f]+)|(0b|0|)(\d+))/gi;
        var match;
        var start;
        var end;
        var numberStr;
        while ((match = re.exec(lineStr)) !== null) {
          start = match.index;
          end = start + match[0].length;
          if (cur.ch < end)break;
        }
        if (!actionArgs.backtrack && (end <= cur.ch))return;
        if (match) {
          var baseStr = match[2] || match[4]
          var digits = match[3] || match[5]
          var increment = actionArgs.increase ? 1 : -1;
          var base = {'0b': 2, '0': 8, '': 10, '0x': 16}[baseStr.toLowerCase()];
          var number = parseInt(match[1] + digits, base) + (increment * actionArgs.repeat);
          numberStr = number.toString(base);
          var zeroPadding = baseStr ? new Array(digits.length - numberStr.length + 1 + match[1].length).join('0') : ''
          if (numberStr.charAt(0) === '-') {
            numberStr = '-' + baseStr + zeroPadding + numberStr.substr(1);
          } else {
            numberStr = baseStr + zeroPadding + numberStr;
          }
          var from = Pos(cur.line, start);
          var to = Pos(cur.line, end);
          cm.replaceRange(numberStr, from, to);
        } else {
          return;
        }
        cm.setCursor(Pos(cur.line, start + numberStr.length - 1));
      },
      repeatLastEdit: function(cm, actionArgs, vim) {
        var lastEditInputState = vim.lastEditInputState;
        if (!lastEditInputState) { return; }
        var repeat = actionArgs.repeat;
        if (repeat && actionArgs.repeatIsExplicit) {
          vim.lastEditInputState.repeatOverride = repeat;
        } else {
          repeat = vim.lastEditInputState.repeatOverride || repeat;
        }
        repeatLastEdit(cm, vim, repeat, false /** repeatForInsert */);
      },
      indent: function(cm, actionArgs) {
        cm.indentLine(cm.getCursor().line, actionArgs.indentRight);
      },
      exitInsertMode: exitInsertMode
    };

    function defineAction(name, fn) {
      actions[name] = fn;
    }

    /*
     * Below are miscellaneous utility functions used by vim.js
     */

    /**
     * Clips cursor to ensure that line is within the buffer's range
     * If includeLineBreak is true, then allow cur.ch == lineLength.
     */
    function clipCursorToContent(cm, cur, includeLineBreak) {
      var line = Math.min(Math.max(cm.firstLine(), cur.line), cm.lastLine() );
      var maxCh = lineLength(cm, line) - 1;
      maxCh = (includeLineBreak) ? maxCh + 1 : maxCh;
      var ch = Math.min(Math.max(0, cur.ch), maxCh);
      return Pos(line, ch);
    }
    function copyArgs(args) {
      var ret = {};
      for (var prop in args) {
        if (args.hasOwnProperty(prop)) {
          ret[prop] = args[prop];
        }
      }
      return ret;
    }
    function offsetCursor(cur, offsetLine, offsetCh) {
      if (typeof offsetLine === 'object') {
        offsetCh = offsetLine.ch;
        offsetLine = offsetLine.line;
      }
      return Pos(cur.line + offsetLine, cur.ch + offsetCh);
    }
    function commandMatches(keys, keyMap, context, inputState) {
      // Partial matches are not applied. They inform the key handler
      // that the current key sequence is a subsequence of a valid key
      // sequence, so that the key buffer is not cleared.
      var match, partial = [], full = [];
      for (var i = 0; i < keyMap.length; i++) {
        var command = keyMap[i];
        if (context == 'insert' && command.context != 'insert' ||
            command.context && command.context != context ||
            inputState.operator && command.type == 'action' ||
            !(match = commandMatch(keys, command.keys))) { continue; }
        if (match == 'partial') { partial.push(command); }
        if (match == 'full') { full.push(command); }
      }
      return {
        partial: partial.length && partial,
        full: full.length && full
      };
    }
    function commandMatch(pressed, mapped) {
      if (mapped.slice(-11) == '<character>') {
        // Last character matches anything.
        var prefixLen = mapped.length - 11;
        var pressedPrefix = pressed.slice(0, prefixLen);
        var mappedPrefix = mapped.slice(0, prefixLen);
        return pressedPrefix == mappedPrefix && pressed.length > prefixLen ? 'full' :
               mappedPrefix.indexOf(pressedPrefix) == 0 ? 'partial' : false;
      } else {
        return pressed == mapped ? 'full' :
               mapped.indexOf(pressed) == 0 ? 'partial' : false;
      }
    }
    function lastChar(keys) {
      var match = /^.*(<[^>]+>)$/.exec(keys);
      var selectedCharacter = match ? match[1] : keys.slice(-1);
      if (selectedCharacter.length > 1){
        switch(selectedCharacter){
          case '<CR>':
            selectedCharacter='\n';
            break;
          case '<Space>':
            selectedCharacter=' ';
            break;
          default:
            selectedCharacter='';
            break;
        }
      }
      return selectedCharacter;
    }
    function repeatFn(cm, fn, repeat) {
      return function() {
        for (var i = 0; i < repeat; i++) {
          fn(cm);
        }
      };
    }
    function copyCursor(cur) {
      return Pos(cur.line, cur.ch);
    }
    function cursorEqual(cur1, cur2) {
      return cur1.ch == cur2.ch && cur1.line == cur2.line;
    }
    function cursorIsBefore(cur1, cur2) {
      if (cur1.line < cur2.line) {
        return true;
      }
      if (cur1.line == cur2.line && cur1.ch < cur2.ch) {
        return true;
      }
      return false;
    }
    function cursorMin(cur1, cur2) {
      if (arguments.length > 2) {
        cur2 = cursorMin.apply(undefined, Array.prototype.slice.call(arguments, 1));
      }
      return cursorIsBefore(cur1, cur2) ? cur1 : cur2;
    }
    function cursorMax(cur1, cur2) {
      if (arguments.length > 2) {
        cur2 = cursorMax.apply(undefined, Array.prototype.slice.call(arguments, 1));
      }
      return cursorIsBefore(cur1, cur2) ? cur2 : cur1;
    }
    function cursorIsBetween(cur1, cur2, cur3) {
      // returns true if cur2 is between cur1 and cur3.
      var cur1before2 = cursorIsBefore(cur1, cur2);
      var cur2before3 = cursorIsBefore(cur2, cur3);
      return cur1before2 && cur2before3;
    }
    function lineLength(cm, lineNum) {
      return cm.getLine(lineNum).length;
    }
    function trim(s) {
      if (s.trim) {
        return s.trim();
      }
      return s.replace(/^\s+|\s+$/g, '');
    }
    function escapeRegex(s) {
      return s.replace(/([.?*+$\[\]\/\\(){}|\-])/g, '\\$1');
    }
    function extendLineToColumn(cm, lineNum, column) {
      var endCh = lineLength(cm, lineNum);
      var spaces = new Array(column-endCh+1).join(' ');
      cm.setCursor(Pos(lineNum, endCh));
      cm.replaceRange(spaces, cm.getCursor());
    }
    // This functions selects a rectangular block
    // of text with selectionEnd as any of its corner
    // Height of block:
    // Difference in selectionEnd.line and first/last selection.line
    // Width of the block:
    // Distance between selectionEnd.ch and any(first considered here) selection.ch
    function selectBlock(cm, selectionEnd) {
      var selections = [], ranges = cm.listSelections();
      var head = copyCursor(cm.clipPos(selectionEnd));
      var isClipped = !cursorEqual(selectionEnd, head);
      var curHead = cm.getCursor('head');
      var primIndex = getIndex(ranges, curHead);
      var wasClipped = cursorEqual(ranges[primIndex].head, ranges[primIndex].anchor);
      var max = ranges.length - 1;
      var index = max - primIndex > primIndex ? max : 0;
      var base = ranges[index].anchor;

      var firstLine = Math.min(base.line, head.line);
      var lastLine = Math.max(base.line, head.line);
      var baseCh = base.ch, headCh = head.ch;

      var dir = ranges[index].head.ch - baseCh;
      var newDir = headCh - baseCh;
      if (dir > 0 && newDir <= 0) {
        baseCh++;
        if (!isClipped) { headCh--; }
      } else if (dir < 0 && newDir >= 0) {
        baseCh--;
        if (!wasClipped) { headCh++; }
      } else if (dir < 0 && newDir == -1) {
        baseCh--;
        headCh++;
      }
      for (var line = firstLine; line <= lastLine; line++) {
        var range = {anchor: new Pos(line, baseCh), head: new Pos(line, headCh)};
        selections.push(range);
      }
      cm.setSelections(selections);
      selectionEnd.ch = headCh;
      base.ch = baseCh;
      return base;
    }
    function selectForInsert(cm, head, height) {
      var sel = [];
      for (var i = 0; i < height; i++) {
        var lineHead = offsetCursor(head, i, 0);
        sel.push({anchor: lineHead, head: lineHead});
      }
      cm.setSelections(sel, 0);
    }
    // getIndex returns the index of the cursor in the selections.
    function getIndex(ranges, cursor, end) {
      for (var i = 0; i < ranges.length; i++) {
        var atAnchor = end != 'head' && cursorEqual(ranges[i].anchor, cursor);
        var atHead = end != 'anchor' && cursorEqual(ranges[i].head, cursor);
        if (atAnchor || atHead) {
          return i;
        }
      }
      return -1;
    }
    function getSelectedAreaRange(cm, vim) {
      var lastSelection = vim.lastSelection;
      var getCurrentSelectedAreaRange = function() {
        var selections = cm.listSelections();
        var start =  selections[0];
        var end = selections[selections.length-1];
        var selectionStart = cursorIsBefore(start.anchor, start.head) ? start.anchor : start.head;
        var selectionEnd = cursorIsBefore(end.anchor, end.head) ? end.head : end.anchor;
        return [selectionStart, selectionEnd];
      };
      var getLastSelectedAreaRange = function() {
        var selectionStart = cm.getCursor();
        var selectionEnd = cm.getCursor();
        var block = lastSelection.visualBlock;
        if (block) {
          var width = block.width;
          var height = block.height;
          selectionEnd = Pos(selectionStart.line + height, selectionStart.ch + width);
          var selections = [];
          // selectBlock creates a 'proper' rectangular block.
          // We do not want that in all cases, so we manually set selections.
          for (var i = selectionStart.line; i < selectionEnd.line; i++) {
            var anchor = Pos(i, selectionStart.ch);
            var head = Pos(i, selectionEnd.ch);
            var range = {anchor: anchor, head: head};
            selections.push(range);
          }
          cm.setSelections(selections);
        } else {
          var start = lastSelection.anchorMark.find();
          var end = lastSelection.headMark.find();
          var line = end.line - start.line;
          var ch = end.ch - start.ch;
          selectionEnd = {line: selectionEnd.line + line, ch: line ? selectionEnd.ch : ch + selectionEnd.ch};
          if (lastSelection.visualLine) {
            selectionStart = Pos(selectionStart.line, 0);
            selectionEnd = Pos(selectionEnd.line, lineLength(cm, selectionEnd.line));
          }
          cm.setSelection(selectionStart, selectionEnd);
        }
        return [selectionStart, selectionEnd];
      };
      if (!vim.visualMode) {
      // In case of replaying the action.
        return getLastSelectedAreaRange();
      } else {
        return getCurrentSelectedAreaRange();
      }
    }
    // Updates the previous selection with the current selection's values. This
    // should only be called in visual mode.
    function updateLastSelection(cm, vim) {
      var anchor = vim.sel.anchor;
      var head = vim.sel.head;
      // To accommodate the effect of lastPastedText in the last selection
      if (vim.lastPastedText) {
        head = cm.posFromIndex(cm.indexFromPos(anchor) + vim.lastPastedText.length);
        vim.lastPastedText = null;
      }
      vim.lastSelection = {'anchorMark': cm.setBookmark(anchor),
                           'headMark': cm.setBookmark(head),
                           'anchor': copyCursor(anchor),
                           'head': copyCursor(head),
                           'visualMode': vim.visualMode,
                           'visualLine': vim.visualLine,
                           'visualBlock': vim.visualBlock};
    }
    function expandSelection(cm, start, end) {
      var sel = cm.state.vim.sel;
      var head = sel.head;
      var anchor = sel.anchor;
      var tmp;
      if (cursorIsBefore(end, start)) {
        tmp = end;
        end = start;
        start = tmp;
      }
      if (cursorIsBefore(head, anchor)) {
        head = cursorMin(start, head);
        anchor = cursorMax(anchor, end);
      } else {
        anchor = cursorMin(start, anchor);
        head = cursorMax(head, end);
        head = offsetCursor(head, 0, -1);
        if (head.ch == -1 && head.line != cm.firstLine()) {
          head = Pos(head.line - 1, lineLength(cm, head.line - 1));
        }
      }
      return [anchor, head];
    }
    /**
     * Updates the CodeMirror selection to match the provided vim selection.
     * If no arguments are given, it uses the current vim selection state.
     */
    function updateCmSelection(cm, sel, mode) {
      var vim = cm.state.vim;
      sel = sel || vim.sel;
      var mode = mode ||
        vim.visualLine ? 'line' : vim.visualBlock ? 'block' : 'char';
      var cmSel = makeCmSelection(cm, sel, mode);
      cm.setSelections(cmSel.ranges, cmSel.primary);
      updateFakeCursor(cm);
    }
    function makeCmSelection(cm, sel, mode, exclusive) {
      var head = copyCursor(sel.head);
      var anchor = copyCursor(sel.anchor);
      if (mode == 'char') {
        var headOffset = !exclusive && !cursorIsBefore(sel.head, sel.anchor) ? 1 : 0;
        var anchorOffset = cursorIsBefore(sel.head, sel.anchor) ? 1 : 0;
        head = offsetCursor(sel.head, 0, headOffset);
        anchor = offsetCursor(sel.anchor, 0, anchorOffset);
        return {
          ranges: [{anchor: anchor, head: head}],
          primary: 0
        };
      } else if (mode == 'line') {
        if (!cursorIsBefore(sel.head, sel.anchor)) {
          anchor.ch = 0;

          var lastLine = cm.lastLine();
          if (head.line > lastLine) {
            head.line = lastLine;
          }
          head.ch = lineLength(cm, head.line);
        } else {
          head.ch = 0;
          anchor.ch = lineLength(cm, anchor.line);
        }
        return {
          ranges: [{anchor: anchor, head: head}],
          primary: 0
        };
      } else if (mode == 'block') {
        var top = Math.min(anchor.line, head.line),
            left = Math.min(anchor.ch, head.ch),
            bottom = Math.max(anchor.line, head.line),
            right = Math.max(anchor.ch, head.ch) + 1;
        var height = bottom - top + 1;
        var primary = head.line == top ? 0 : height - 1;
        var ranges = [];
        for (var i = 0; i < height; i++) {
          ranges.push({
            anchor: Pos(top + i, left),
            head: Pos(top + i, right)
          });
        }
        return {
          ranges: ranges,
          primary: primary
        };
      }
    }
    function getHead(cm) {
      var cur = cm.getCursor('head');
      if (cm.getSelection().length == 1) {
        // Small corner case when only 1 character is selected. The "real"
        // head is the left of head and anchor.
        cur = cursorMin(cur, cm.getCursor('anchor'));
      }
      return cur;
    }

    /**
     * If moveHead is set to false, the CodeMirror selection will not be
     * touched. The caller assumes the responsibility of putting the cursor
    * in the right place.
     */
    function exitVisualMode(cm, moveHead) {
      var vim = cm.state.vim;
      if (moveHead !== false) {
        cm.setCursor(clipCursorToContent(cm, vim.sel.head));
      }
      updateLastSelection(cm, vim);
      vim.visualMode = false;
      vim.visualLine = false;
      vim.visualBlock = false;
      CodeMirror.signal(cm, "vim-mode-change", {mode: "normal"});
      if (vim.fakeCursor) {
        vim.fakeCursor.clear();
      }
    }

    // Remove any trailing newlines from the selection. For
    // example, with the caret at the start of the last word on the line,
    // 'dw' should word, but not the newline, while 'w' should advance the
    // caret to the first character of the next line.
    function clipToLine(cm, curStart, curEnd) {
      var selection = cm.getRange(curStart, curEnd);
      // Only clip if the selection ends with trailing newline + whitespace
      if (/\n\s*$/.test(selection)) {
        var lines = selection.split('\n');
        // We know this is all whitespace.
        lines.pop();

        // Cases:
        // 1. Last word is an empty line - do not clip the trailing '\n'
        // 2. Last word is not an empty line - clip the trailing '\n'
        var line;
        // Find the line containing the last word, and clip all whitespace up
        // to it.
        for (var line = lines.pop(); lines.length > 0 && line && isWhiteSpaceString(line); line = lines.pop()) {
          curEnd.line--;
          curEnd.ch = 0;
        }
        // If the last word is not an empty line, clip an additional newline
        if (line) {
          curEnd.line--;
          curEnd.ch = lineLength(cm, curEnd.line);
        } else {
          curEnd.ch = 0;
        }
      }
    }

    // Expand the selection to line ends.
    function expandSelectionToLine(_cm, curStart, curEnd) {
      curStart.ch = 0;
      curEnd.ch = 0;
      curEnd.line++;
    }

    function findFirstNonWhiteSpaceCharacter(text) {
      if (!text) {
        return 0;
      }
      var firstNonWS = text.search(/\S/);
      return firstNonWS == -1 ? text.length : firstNonWS;
    }

    function expandWordUnderCursor(cm, inclusive, _forward, bigWord, noSymbol) {
      var cur = getHead(cm);
      var line = cm.getLine(cur.line);
      var idx = cur.ch;

      // Seek to first word or non-whitespace character, depending on if
      // noSymbol is true.
      var test = noSymbol ? wordCharTest[0] : bigWordCharTest [0];
      while (!test(line.charAt(idx))) {
        idx++;
        if (idx >= line.length) { return null; }
      }

      if (bigWord) {
        test = bigWordCharTest[0];
      } else {
        test = wordCharTest[0];
        if (!test(line.charAt(idx))) {
          test = wordCharTest[1];
        }
      }

      var end = idx, start = idx;
      while (test(line.charAt(end)) && end < line.length) { end++; }
      while (test(line.charAt(start)) && start >= 0) { start--; }
      start++;

      if (inclusive) {
        // If present, include all whitespace after word.
        // Otherwise, include all whitespace before word, except indentation.
        var wordEnd = end;
        while (/\s/.test(line.charAt(end)) && end < line.length) { end++; }
        if (wordEnd == end) {
          var wordStart = start;
          while (/\s/.test(line.charAt(start - 1)) && start > 0) { start--; }
          if (!start) { start = wordStart; }
        }
      }
      return { start: Pos(cur.line, start), end: Pos(cur.line, end) };
    }

    function recordJumpPosition(cm, oldCur, newCur) {
      if (!cursorEqual(oldCur, newCur)) {
        vimGlobalState.jumpList.add(cm, oldCur, newCur);
      }
    }

    function recordLastCharacterSearch(increment, args) {
        vimGlobalState.lastCharacterSearch.increment = increment;
        vimGlobalState.lastCharacterSearch.forward = args.forward;
        vimGlobalState.lastCharacterSearch.selectedCharacter = args.selectedCharacter;
    }

    var symbolToMode = {
        '(': 'bracket', ')': 'bracket', '{': 'bracket', '}': 'bracket',
        '[': 'section', ']': 'section',
        '*': 'comment', '/': 'comment',
        'm': 'method', 'M': 'method',
        '#': 'preprocess'
    };
    var findSymbolModes = {
      bracket: {
        isComplete: function(state) {
          if (state.nextCh === state.symb) {
            state.depth++;
            if (state.depth >= 1)return true;
          } else if (state.nextCh === state.reverseSymb) {
            state.depth--;
          }
          return false;
        }
      },
      section: {
        init: function(state) {
          state.curMoveThrough = true;
          state.symb = (state.forward ? ']' : '[') === state.symb ? '{' : '}';
        },
        isComplete: function(state) {
          return state.index === 0 && state.nextCh === state.symb;
        }
      },
      comment: {
        isComplete: function(state) {
          var found = state.lastCh === '*' && state.nextCh === '/';
          state.lastCh = state.nextCh;
          return found;
        }
      },
      // TODO: The original Vim implementation only operates on level 1 and 2.
      // The current implementation doesn't check for code block level and
      // therefore it operates on any levels.
      method: {
        init: function(state) {
          state.symb = (state.symb === 'm' ? '{' : '}');
          state.reverseSymb = state.symb === '{' ? '}' : '{';
        },
        isComplete: function(state) {
          if (state.nextCh === state.symb)return true;
          return false;
        }
      },
      preprocess: {
        init: function(state) {
          state.index = 0;
        },
        isComplete: function(state) {
          if (state.nextCh === '#') {
            var token = state.lineText.match(/#(\w+)/)[1];
            if (token === 'endif') {
              if (state.forward && state.depth === 0) {
                return true;
              }
              state.depth++;
            } else if (token === 'if') {
              if (!state.forward && state.depth === 0) {
                return true;
              }
              state.depth--;
            }
            if (token === 'else' && state.depth === 0)return true;
          }
          return false;
        }
      }
    };
    function findSymbol(cm, repeat, forward, symb) {
      var cur = copyCursor(cm.getCursor());
      var increment = forward ? 1 : -1;
      var endLine = forward ? cm.lineCount() : -1;
      var curCh = cur.ch;
      var line = cur.line;
      var lineText = cm.getLine(line);
      var state = {
        lineText: lineText,
        nextCh: lineText.charAt(curCh),
        lastCh: null,
        index: curCh,
        symb: symb,
        reverseSymb: (forward ?  { ')': '(', '}': '{' } : { '(': ')', '{': '}' })[symb],
        forward: forward,
        depth: 0,
        curMoveThrough: false
      };
      var mode = symbolToMode[symb];
      if (!mode)return cur;
      var init = findSymbolModes[mode].init;
      var isComplete = findSymbolModes[mode].isComplete;
      if (init) { init(state); }
      while (line !== endLine && repeat) {
        state.index += increment;
        state.nextCh = state.lineText.charAt(state.index);
        if (!state.nextCh) {
          line += increment;
          state.lineText = cm.getLine(line) || '';
          if (increment > 0) {
            state.index = 0;
          } else {
            var lineLen = state.lineText.length;
            state.index = (lineLen > 0) ? (lineLen-1) : 0;
          }
          state.nextCh = state.lineText.charAt(state.index);
        }
        if (isComplete(state)) {
          cur.line = line;
          cur.ch = state.index;
          repeat--;
        }
      }
      if (state.nextCh || state.curMoveThrough) {
        return Pos(line, state.index);
      }
      return cur;
    }

    /*
     * Returns the boundaries of the next word. If the cursor in the middle of
     * the word, then returns the boundaries of the current word, starting at
     * the cursor. If the cursor is at the start/end of a word, and we are going
     * forward/backward, respectively, find the boundaries of the next word.
     *
     * @param {CodeMirror} cm CodeMirror object.
     * @param {Cursor} cur The cursor position.
     * @param {boolean} forward True to search forward. False to search
     *     backward.
     * @param {boolean} bigWord True if punctuation count as part of the word.
     *     False if only [a-zA-Z0-9] characters count as part of the word.
     * @param {boolean} emptyLineIsWord True if empty lines should be treated
     *     as words.
     * @return {Object{from:number, to:number, line: number}} The boundaries of
     *     the word, or null if there are no more words.
     */
    function findWord(cm, cur, forward, bigWord, emptyLineIsWord) {
      var lineNum = cur.line;
      var pos = cur.ch;
      var line = cm.getLine(lineNum);
      var dir = forward ? 1 : -1;
      var charTests = bigWord ? bigWordCharTest: wordCharTest;

      if (emptyLineIsWord && line == '') {
        lineNum += dir;
        line = cm.getLine(lineNum);
        if (!isLine(cm, lineNum)) {
          return null;
        }
        pos = (forward) ? 0 : line.length;
      }

      while (true) {
        if (emptyLineIsWord && line == '') {
          return { from: 0, to: 0, line: lineNum };
        }
        var stop = (dir > 0) ? line.length : -1;
        var wordStart = stop, wordEnd = stop;
        // Find bounds of next word.
        while (pos != stop) {
          var foundWord = false;
          for (var i = 0; i < charTests.length && !foundWord; ++i) {
            if (charTests[i](line.charAt(pos))) {
              wordStart = pos;
              // Advance to end of word.
              while (pos != stop && charTests[i](line.charAt(pos))) {
                pos += dir;
              }
              wordEnd = pos;
              foundWord = wordStart != wordEnd;
              if (wordStart == cur.ch && lineNum == cur.line &&
                  wordEnd == wordStart + dir) {
                // We started at the end of a word. Find the next one.
                continue;
              } else {
                return {
                  from: Math.min(wordStart, wordEnd + 1),
                  to: Math.max(wordStart, wordEnd),
                  line: lineNum };
              }
            }
          }
          if (!foundWord) {
            pos += dir;
          }
        }
        // Advance to next/prev line.
        lineNum += dir;
        if (!isLine(cm, lineNum)) {
          return null;
        }
        line = cm.getLine(lineNum);
        pos = (dir > 0) ? 0 : line.length;
      }
    }

    /**
     * @param {CodeMirror} cm CodeMirror object.
     * @param {Pos} cur The position to start from.
     * @param {int} repeat Number of words to move past.
     * @param {boolean} forward True to search forward. False to search
     *     backward.
     * @param {boolean} wordEnd True to move to end of word. False to move to
     *     beginning of word.
     * @param {boolean} bigWord True if punctuation count as part of the word.
     *     False if only alphabet characters count as part of the word.
     * @return {Cursor} The position the cursor should move to.
     */
    function moveToWord(cm, cur, repeat, forward, wordEnd, bigWord) {
      var curStart = copyCursor(cur);
      var words = [];
      if (forward && !wordEnd || !forward && wordEnd) {
        repeat++;
      }
      // For 'e', empty lines are not considered words, go figure.
      var emptyLineIsWord = !(forward && wordEnd);
      for (var i = 0; i < repeat; i++) {
        var word = findWord(cm, cur, forward, bigWord, emptyLineIsWord);
        if (!word) {
          var eodCh = lineLength(cm, cm.lastLine());
          words.push(forward
              ? {line: cm.lastLine(), from: eodCh, to: eodCh}
              : {line: 0, from: 0, to: 0});
          break;
        }
        words.push(word);
        cur = Pos(word.line, forward ? (word.to - 1) : word.from);
      }
      var shortCircuit = words.length != repeat;
      var firstWord = words[0];
      var lastWord = words.pop();
      if (forward && !wordEnd) {
        // w
        if (!shortCircuit && (firstWord.from != curStart.ch || firstWord.line != curStart.line)) {
          // We did not start in the middle of a word. Discard the extra word at the end.
          lastWord = words.pop();
        }
        return Pos(lastWord.line, lastWord.from);
      } else if (forward && wordEnd) {
        return Pos(lastWord.line, lastWord.to - 1);
      } else if (!forward && wordEnd) {
        // ge
        if (!shortCircuit && (firstWord.to != curStart.ch || firstWord.line != curStart.line)) {
          // We did not start in the middle of a word. Discard the extra word at the end.
          lastWord = words.pop();
        }
        return Pos(lastWord.line, lastWord.to);
      } else {
        // b
        return Pos(lastWord.line, lastWord.from);
      }
    }

    function moveToCharacter(cm, repeat, forward, character) {
      var cur = cm.getCursor();
      var start = cur.ch;
      var idx;
      for (var i = 0; i < repeat; i ++) {
        var line = cm.getLine(cur.line);
        idx = charIdxInLine(start, line, character, forward, true);
        if (idx == -1) {
          return null;
        }
        start = idx;
      }
      return Pos(cm.getCursor().line, idx);
    }

    function moveToColumn(cm, repeat) {
      // repeat is always >= 1, so repeat - 1 always corresponds
      // to the column we want to go to.
      var line = cm.getCursor().line;
      return clipCursorToContent(cm, Pos(line, repeat - 1));
    }

    function updateMark(cm, vim, markName, pos) {
      if (!inArray(markName, validMarks)) {
        return;
      }
      if (vim.marks[markName]) {
        vim.marks[markName].clear();
      }
      vim.marks[markName] = cm.setBookmark(pos);
    }

    function charIdxInLine(start, line, character, forward, includeChar) {
      // Search for char in line.
      // motion_options: {forward, includeChar}
      // If includeChar = true, include it too.
      // If forward = true, search forward, else search backwards.
      // If char is not found on this line, do nothing
      var idx;
      if (forward) {
        idx = line.indexOf(character, start + 1);
        if (idx != -1 && !includeChar) {
          idx -= 1;
        }
      } else {
        idx = line.lastIndexOf(character, start - 1);
        if (idx != -1 && !includeChar) {
          idx += 1;
        }
      }
      return idx;
    }

    function findParagraph(cm, head, repeat, dir, inclusive) {
      var line = head.line;
      var min = cm.firstLine();
      var max = cm.lastLine();
      var start, end, i = line;
      function isEmpty(i) { return !cm.getLine(i); }
      function isBoundary(i, dir, any) {
        if (any) { return isEmpty(i) != isEmpty(i + dir); }
        return !isEmpty(i) && isEmpty(i + dir);
      }
      if (dir) {
        while (min <= i && i <= max && repeat > 0) {
          if (isBoundary(i, dir)) { repeat--; }
          i += dir;
        }
        return new Pos(i, 0);
      }

      var vim = cm.state.vim;
      if (vim.visualLine && isBoundary(line, 1, true)) {
        var anchor = vim.sel.anchor;
        if (isBoundary(anchor.line, -1, true)) {
          if (!inclusive || anchor.line != line) {
            line += 1;
          }
        }
      }
      var startState = isEmpty(line);
      for (i = line; i <= max && repeat; i++) {
        if (isBoundary(i, 1, true)) {
          if (!inclusive || isEmpty(i) != startState) {
            repeat--;
          }
        }
      }
      end = new Pos(i, 0);
      // select boundary before paragraph for the last one
      if (i > max && !startState) { startState = true; }
      else { inclusive = false; }
      for (i = line; i > min; i--) {
        if (!inclusive || isEmpty(i) == startState || i == line) {
          if (isBoundary(i, -1, true)) { break; }
        }
      }
      start = new Pos(i, 0);
      return { start: start, end: end };
    }

    function findSentence(cm, cur, repeat, dir) {

      /*
        Takes an index object
        {
          line: the line string,
          ln: line number,
          pos: index in line,
          dir: direction of traversal (-1 or 1)
        }
        and modifies the line, ln, and pos members to represent the
        next valid position or sets them to null if there are
        no more valid positions.
       */
      function nextChar(cm, idx) {
        if (idx.pos + idx.dir < 0 || idx.pos + idx.dir >= idx.line.length) {
          idx.ln += idx.dir;
          if (!isLine(cm, idx.ln)) {
            idx.line = null;
            idx.ln = null;
            idx.pos = null;
            return;
          }
          idx.line = cm.getLine(idx.ln);
          idx.pos = (idx.dir > 0) ? 0 : idx.line.length - 1;
        }
        else {
          idx.pos += idx.dir;
        }
      }

      /*
        Performs one iteration of traversal in forward direction
        Returns an index object of the new location
       */
      function forward(cm, ln, pos, dir) {
        var line = cm.getLine(ln);
        var stop = (line === "");

        var curr = {
          line: line,
          ln: ln,
          pos: pos,
          dir: dir,
        }

        var last_valid = {
          ln: curr.ln,
          pos: curr.pos,
        }

        var skip_empty_lines = (curr.line === "");

        // Move one step to skip character we start on
        nextChar(cm, curr);

        while (curr.line !== null) {
          last_valid.ln = curr.ln;
          last_valid.pos = curr.pos;

          if (curr.line === "" && !skip_empty_lines) {
            return { ln: curr.ln, pos: curr.pos, };
          }
          else if (stop && curr.line !== "" && !isWhiteSpaceString(curr.line[curr.pos])) {
            return { ln: curr.ln, pos: curr.pos, };
          }
          else if (isEndOfSentenceSymbol(curr.line[curr.pos])
            && !stop
            && (curr.pos === curr.line.length - 1
              || isWhiteSpaceString(curr.line[curr.pos + 1]))) {
            stop = true;
          }

          nextChar(cm, curr);
        }

        /*
          Set the position to the last non whitespace character on the last
          valid line in the case that we reach the end of the document.
        */
        var line = cm.getLine(last_valid.ln);
        last_valid.pos = 0;
        for(var i = line.length - 1; i >= 0; --i) {
          if (!isWhiteSpaceString(line[i])) {
            last_valid.pos = i;
            break;
          }
        }

        return last_valid;

      }

      /*
        Performs one iteration of traversal in reverse direction
        Returns an index object of the new location
       */
      function reverse(cm, ln, pos, dir) {
        var line = cm.getLine(ln);

        var curr = {
          line: line,
          ln: ln,
          pos: pos,
          dir: dir,
        }

        var last_valid = {
          ln: curr.ln,
          pos: null,
        };

        var skip_empty_lines = (curr.line === "");

        // Move one step to skip character we start on
        nextChar(cm, curr);

        while (curr.line !== null) {

          if (curr.line === "" && !skip_empty_lines) {
            if (last_valid.pos !== null) {
              return last_valid;
            }
            else {
              return { ln: curr.ln, pos: curr.pos };
            }
          }
          else if (isEndOfSentenceSymbol(curr.line[curr.pos])
              && last_valid.pos !== null
              && !(curr.ln === last_valid.ln && curr.pos + 1 === last_valid.pos)) {
            return last_valid;
          }
          else if (curr.line !== "" && !isWhiteSpaceString(curr.line[curr.pos])) {
            skip_empty_lines = false;
            last_valid = { ln: curr.ln, pos: curr.pos }
          }

          nextChar(cm, curr);
        }

        /*
          Set the position to the first non whitespace character on the last
          valid line in the case that we reach the beginning of the document.
        */
        var line = cm.getLine(last_valid.ln);
        last_valid.pos = 0;
        for(var i = 0; i < line.length; ++i) {
          if (!isWhiteSpaceString(line[i])) {
            last_valid.pos = i;
            break;
          }
        }
        return last_valid;
      }

      var curr_index = {
        ln: cur.line,
        pos: cur.ch,
      };

      while (repeat > 0) {
        if (dir < 0) {
          curr_index = reverse(cm, curr_index.ln, curr_index.pos, dir);
        }
        else {
          curr_index = forward(cm, curr_index.ln, curr_index.pos, dir);
        }
        repeat--;
      }

      return Pos(curr_index.ln, curr_index.pos);
    }

    // TODO: perhaps this finagling of start and end positions belonds
    // in codemirror/replaceRange?
    function selectCompanionObject(cm, head, symb, inclusive) {
      var cur = head, start, end;

      var bracketRegexp = ({
        '(': /[()]/, ')': /[()]/,
        '[': /[[\]]/, ']': /[[\]]/,
        '{': /[{}]/, '}': /[{}]/,
        '<': /[<>]/, '>': /[<>]/})[symb];
      var openSym = ({
        '(': '(', ')': '(',
        '[': '[', ']': '[',
        '{': '{', '}': '{',
        '<': '<', '>': '<'})[symb];
      var curChar = cm.getLine(cur.line).charAt(cur.ch);
      // Due to the behavior of scanForBracket, we need to add an offset if the
      // cursor is on a matching open bracket.
      var offset = curChar === openSym ? 1 : 0;

      start = cm.scanForBracket(Pos(cur.line, cur.ch + offset), -1, undefined, {'bracketRegex': bracketRegexp});
      end = cm.scanForBracket(Pos(cur.line, cur.ch + offset), 1, undefined, {'bracketRegex': bracketRegexp});

      if (!start || !end) {
        return { start: cur, end: cur };
      }

      start = start.pos;
      end = end.pos;

      if ((start.line == end.line && start.ch > end.ch)
          || (start.line > end.line)) {
        var tmp = start;
        start = end;
        end = tmp;
      }

      if (inclusive) {
        end.ch += 1;
      } else {
        start.ch += 1;
      }

      return { start: start, end: end };
    }

    // Takes in a symbol and a cursor and tries to simulate text objects that
    // have identical opening and closing symbols
    // TODO support across multiple lines
    function findBeginningAndEnd(cm, head, symb, inclusive) {
      var cur = copyCursor(head);
      var line = cm.getLine(cur.line);
      var chars = line.split('');
      var start, end, i, len;
      var firstIndex = chars.indexOf(symb);

      // the decision tree is to always look backwards for the beginning first,
      // but if the cursor is in front of the first instance of the symb,
      // then move the cursor forward
      if (cur.ch < firstIndex) {
        cur.ch = firstIndex;
        // Why is this line even here???
        // cm.setCursor(cur.line, firstIndex+1);
      }
      // otherwise if the cursor is currently on the closing symbol
      else if (firstIndex < cur.ch && chars[cur.ch] == symb) {
        end = cur.ch; // assign end to the current cursor
        --cur.ch; // make sure to look backwards
      }

      // if we're currently on the symbol, we've got a start
      if (chars[cur.ch] == symb && !end) {
        start = cur.ch + 1; // assign start to ahead of the cursor
      } else {
        // go backwards to find the start
        for (i = cur.ch; i > -1 && !start; i--) {
          if (chars[i] == symb) {
            start = i + 1;
          }
        }
      }

      // look forwards for the end symbol
      if (start && !end) {
        for (i = start, len = chars.length; i < len && !end; i++) {
          if (chars[i] == symb) {
            end = i;
          }
        }
      }

      // nothing found
      if (!start || !end) {
        return { start: cur, end: cur };
      }

      // include the symbols
      if (inclusive) {
        --start; ++end;
      }

      return {
        start: Pos(cur.line, start),
        end: Pos(cur.line, end)
      };
    }

    // Search functions
    defineOption('pcre', true, 'boolean');
    function SearchState() {}
    SearchState.prototype = {
      getQuery: function() {
        return vimGlobalState.query;
      },
      setQuery: function(query) {
        vimGlobalState.query = query;
      },
      getOverlay: function() {
        return this.searchOverlay;
      },
      setOverlay: function(overlay) {
        this.searchOverlay = overlay;
      },
      isReversed: function() {
        return vimGlobalState.isReversed;
      },
      setReversed: function(reversed) {
        vimGlobalState.isReversed = reversed;
      },
      getScrollbarAnnotate: function() {
        return this.annotate;
      },
      setScrollbarAnnotate: function(annotate) {
        this.annotate = annotate;
      }
    };
    function getSearchState(cm) {
      var vim = cm.state.vim;
      return vim.searchState_ || (vim.searchState_ = new SearchState());
    }
    function dialog(cm, template, shortText, onClose, options) {
      if (cm.openDialog) {
        cm.openDialog(template, onClose, { bottom: true, value: options.value,
            onKeyDown: options.onKeyDown, onKeyUp: options.onKeyUp,
            selectValueOnOpen: false});
      }
      else {
        onClose(prompt(shortText, ''));
      }
    }
    function splitBySlash(argString) {
      return splitBySeparator(argString, '/');
    }

    function findUnescapedSlashes(argString) {
      return findUnescapedSeparators(argString, '/');
    }

    function splitBySeparator(argString, separator) {
      var slashes = findUnescapedSeparators(argString, separator) || [];
      if (!slashes.length) return [];
      var tokens = [];
      // in case of strings like foo/bar
      if (slashes[0] !== 0) return;
      for (var i = 0; i < slashes.length; i++) {
        if (typeof slashes[i] == 'number')
          tokens.push(argString.substring(slashes[i] + 1, slashes[i+1]));
      }
      return tokens;
    }

    function findUnescapedSeparators(str, separator) {
      if (!separator)
        separator = '/';

      var escapeNextChar = false;
      var slashes = [];
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (!escapeNextChar && c == separator) {
          slashes.push(i);
        }
        escapeNextChar = !escapeNextChar && (c == '\\');
      }
      return slashes;
    }

    // Translates a search string from ex (vim) syntax into javascript form.
    function translateRegex(str) {
      // When these match, add a '\' if unescaped or remove one if escaped.
      var specials = '|(){';
      // Remove, but never add, a '\' for these.
      var unescape = '}';
      var escapeNextChar = false;
      var out = [];
      for (var i = -1; i < str.length; i++) {
        var c = str.charAt(i) || '';
        var n = str.charAt(i+1) || '';
        var specialComesNext = (n && specials.indexOf(n) != -1);
        if (escapeNextChar) {
          if (c !== '\\' || !specialComesNext) {
            out.push(c);
          }
          escapeNextChar = false;
        } else {
          if (c === '\\') {
            escapeNextChar = true;
            // Treat the unescape list as special for removing, but not adding '\'.
            if (n && unescape.indexOf(n) != -1) {
              specialComesNext = true;
            }
            // Not passing this test means removing a '\'.
            if (!specialComesNext || n === '\\') {
              out.push(c);
            }
          } else {
            out.push(c);
            if (specialComesNext && n !== '\\') {
              out.push('\\');
            }
          }
        }
      }
      return out.join('');
    }

    // Translates the replace part of a search and replace from ex (vim) syntax into
    // javascript form.  Similar to translateRegex, but additionally fixes back references
    // (translates '\[0..9]' to '$[0..9]') and follows different rules for escaping '$'.
    var charUnescapes = {'\\n': '\n', '\\r': '\r', '\\t': '\t'};
    function translateRegexReplace(str) {
      var escapeNextChar = false;
      var out = [];
      for (var i = -1; i < str.length; i++) {
        var c = str.charAt(i) || '';
        var n = str.charAt(i+1) || '';
        if (charUnescapes[c + n]) {
          out.push(charUnescapes[c+n]);
          i++;
        } else if (escapeNextChar) {
          // At any point in the loop, escapeNextChar is true if the previous
          // character was a '\' and was not escaped.
          out.push(c);
          escapeNextChar = false;
        } else {
          if (c === '\\') {
            escapeNextChar = true;
            if ((isNumber(n) || n === '$')) {
              out.push('$');
            } else if (n !== '/' && n !== '\\') {
              out.push('\\');
            }
          } else {
            if (c === '$') {
              out.push('$');
            }
            out.push(c);
            if (n === '/') {
              out.push('\\');
            }
          }
        }
      }
      return out.join('');
    }

    // Unescape \ and / in the replace part, for PCRE mode.
    var unescapes = {'\\/': '/', '\\\\': '\\', '\\n': '\n', '\\r': '\r', '\\t': '\t', '\\&':'&'};
    function unescapeRegexReplace(str) {
      var stream = new CodeMirror.StringStream(str);
      var output = [];
      while (!stream.eol()) {
        // Search for \.
        while (stream.peek() && stream.peek() != '\\') {
          output.push(stream.next());
        }
        var matched = false;
        for (var matcher in unescapes) {
          if (stream.match(matcher, true)) {
            matched = true;
            output.push(unescapes[matcher]);
            break;
          }
        }
        if (!matched) {
          // Don't change anything
          output.push(stream.next());
        }
      }
      return output.join('');
    }

    /**
     * Extract the regular expression from the query and return a Regexp object.
     * Returns null if the query is blank.
     * If ignoreCase is passed in, the Regexp object will have the 'i' flag set.
     * If smartCase is passed in, and the query contains upper case letters,
     *   then ignoreCase is overridden, and the 'i' flag will not be set.
     * If the query contains the /i in the flag part of the regular expression,
     *   then both ignoreCase and smartCase are ignored, and 'i' will be passed
     *   through to the Regex object.
     */
    function parseQuery(query, ignoreCase, smartCase) {
      // First update the last search register
      var lastSearchRegister = vimGlobalState.registerController.getRegister('/');
      lastSearchRegister.setText(query);
      // Check if the query is already a regex.
      if (query instanceof RegExp) { return query; }
      // First try to extract regex + flags from the input. If no flags found,
      // extract just the regex. IE does not accept flags directly defined in
      // the regex string in the form /regex/flags
      var slashes = findUnescapedSlashes(query);
      var regexPart;
      var forceIgnoreCase;
      if (!slashes.length) {
        // Query looks like 'regexp'
        regexPart = query;
      } else {
        // Query looks like 'regexp/...'
        regexPart = query.substring(0, slashes[0]);
        var flagsPart = query.substring(slashes[0]);
        forceIgnoreCase = (flagsPart.indexOf('i') != -1);
      }
      if (!regexPart) {
        return null;
      }
      if (!getOption('pcre')) {
        regexPart = translateRegex(regexPart);
      }
      if (smartCase) {
        ignoreCase = (/^[^A-Z]*$/).test(regexPart);
      }
      var regexp = new RegExp(regexPart,
          (ignoreCase || forceIgnoreCase) ? 'i' : undefined);
      return regexp;
    }
    function showConfirm(cm, text) {
      if (cm.openNotification) {
        cm.openNotification('<span style="color: red">' + text + '</span>',
                            {bottom: true, duration: 5000});
      } else {
        alert(text);
      }
    }
    function makePrompt(prefix, desc) {
      var raw = '<span style="font-family: monospace; white-space: pre">' +
          (prefix || "") + '<input type="text"></span>';
      if (desc)
        raw += ' <span style="color: #888">' + desc + '</span>';
      return raw;
    }
    var searchPromptDesc = '(Javascript regexp)';
    function showPrompt(cm, options) {
      var shortText = (options.prefix || '') + ' ' + (options.desc || '');
      var prompt = makePrompt(options.prefix, options.desc);
      dialog(cm, prompt, shortText, options.onClose, options);
    }
    function regexEqual(r1, r2) {
      if (r1 instanceof RegExp && r2 instanceof RegExp) {
          var props = ['global', 'multiline', 'ignoreCase', 'source'];
          for (var i = 0; i < props.length; i++) {
              var prop = props[i];
              if (r1[prop] !== r2[prop]) {
                  return false;
              }
          }
          return true;
      }
      return false;
    }
    // Returns true if the query is valid.
    function updateSearchQuery(cm, rawQuery, ignoreCase, smartCase) {
      if (!rawQuery) {
        return;
      }
      var state = getSearchState(cm);
      var query = parseQuery(rawQuery, !!ignoreCase, !!smartCase);
      if (!query) {
        return;
      }
      highlightSearchMatches(cm, query);
      if (regexEqual(query, state.getQuery())) {
        return query;
      }
      state.setQuery(query);
      return query;
    }
    function searchOverlay(query) {
      if (query.source.charAt(0) == '^') {
        var matchSol = true;
      }
      return {
        token: function(stream) {
          if (matchSol && !stream.sol()) {
            stream.skipToEnd();
            return;
          }
          var match = stream.match(query, false);
          if (match) {
            if (match[0].length == 0) {
              // Matched empty string, skip to next.
              stream.next();
              return 'searching';
            }
            if (!stream.sol()) {
              // Backtrack 1 to match \b
              stream.backUp(1);
              if (!query.exec(stream.next() + match[0])) {
                stream.next();
                return null;
              }
            }
            stream.match(query);
            return 'searching';
          }
          while (!stream.eol()) {
            stream.next();
            if (stream.match(query, false)) break;
          }
        },
        query: query
      };
    }
    var highlightTimeout = 0;
    function highlightSearchMatches(cm, query) {
      clearTimeout(highlightTimeout);
      highlightTimeout = setTimeout(function() {
        var searchState = getSearchState(cm);
        var overlay = searchState.getOverlay();
        if (!overlay || query != overlay.query) {
          if (overlay) {
            cm.removeOverlay(overlay);
          }
          overlay = searchOverlay(query);
          cm.addOverlay(overlay);
          if (cm.showMatchesOnScrollbar) {
            if (searchState.getScrollbarAnnotate()) {
              searchState.getScrollbarAnnotate().clear();
            }
            searchState.setScrollbarAnnotate(cm.showMatchesOnScrollbar(query));
          }
          searchState.setOverlay(overlay);
        }
      }, 50);
    }
    function findNext(cm, prev, query, repeat) {
      if (repeat === undefined) { repeat = 1; }
      return cm.operation(function() {
        var pos = cm.getCursor();
        var cursor = cm.getSearchCursor(query, pos);
        for (var i = 0; i < repeat; i++) {
          var found = cursor.find(prev);
          if (i == 0 && found && cursorEqual(cursor.from(), pos)) { found = cursor.find(prev); }
          if (!found) {
            // SearchCursor may have returned null because it hit EOF, wrap
            // around and try again.
            cursor = cm.getSearchCursor(query,
                (prev) ? Pos(cm.lastLine()) : Pos(cm.firstLine(), 0) );
            if (!cursor.find(prev)) {
              return;
            }
          }
        }
        return cursor.from();
      });
    }
    function clearSearchHighlight(cm) {
      var state = getSearchState(cm);
      cm.removeOverlay(getSearchState(cm).getOverlay());
      state.setOverlay(null);
      if (state.getScrollbarAnnotate()) {
        state.getScrollbarAnnotate().clear();
        state.setScrollbarAnnotate(null);
      }
    }
    /**
     * Check if pos is in the specified range, INCLUSIVE.
     * Range can be specified with 1 or 2 arguments.
     * If the first range argument is an array, treat it as an array of line
     * numbers. Match pos against any of the lines.
     * If the first range argument is a number,
     *   if there is only 1 range argument, check if pos has the same line
     *       number
     *   if there are 2 range arguments, then check if pos is in between the two
     *       range arguments.
     */
    function isInRange(pos, start, end) {
      if (typeof pos != 'number') {
        // Assume it is a cursor position. Get the line number.
        pos = pos.line;
      }
      if (start instanceof Array) {
        return inArray(pos, start);
      } else {
        if (end) {
          return (pos >= start && pos <= end);
        } else {
          return pos == start;
        }
      }
    }
    function getUserVisibleLines(cm) {
      var scrollInfo = cm.getScrollInfo();
      var occludeToleranceTop = 6;
      var occludeToleranceBottom = 10;
      var from = cm.coordsChar({left:0, top: occludeToleranceTop + scrollInfo.top}, 'local');
      var bottomY = scrollInfo.clientHeight - occludeToleranceBottom + scrollInfo.top;
      var to = cm.coordsChar({left:0, top: bottomY}, 'local');
      return {top: from.line, bottom: to.line};
    }

    function getMarkPos(cm, vim, markName) {
      if (markName == '\'') {
        var history = cm.doc.history.done;
        var event = history[history.length - 2];
        return event && event.ranges && event.ranges[0].head;
      } else if (markName == '.') {
        if (cm.doc.history.lastModTime == 0) {
          return  // If no changes, bail out; don't bother to copy or reverse history array.
        } else {
          var changeHistory = cm.doc.history.done.filter(function(el){ if (el.changes !== undefined) { return el } });
          changeHistory.reverse();
          var lastEditPos = changeHistory[0].changes[0].to;
        }
        return lastEditPos;
      }

      var mark = vim.marks[markName];
      return mark && mark.find();
    }

    var ExCommandDispatcher = function() {
      this.buildCommandMap_();
    };
    ExCommandDispatcher.prototype = {
      processCommand: function(cm, input, opt_params) {
        var that = this;
        cm.operation(function () {
          cm.curOp.isVimOp = true;
          that._processCommand(cm, input, opt_params);
        });
      },
      _processCommand: function(cm, input, opt_params) {
        var vim = cm.state.vim;
        var commandHistoryRegister = vimGlobalState.registerController.getRegister(':');
        var previousCommand = commandHistoryRegister.toString();
        if (vim.visualMode) {
          exitVisualMode(cm);
        }
        var inputStream = new CodeMirror.StringStream(input);
        // update ": with the latest command whether valid or invalid
        commandHistoryRegister.setText(input);
        var params = opt_params || {};
        params.input = input;
        try {
          this.parseInput_(cm, inputStream, params);
        } catch(e) {
          showConfirm(cm, e);
          throw e;
        }
        var command;
        var commandName;
        if (!params.commandName) {
          // If only a line range is defined, move to the line.
          if (params.line !== undefined) {
            commandName = 'move';
          }
        } else {
          command = this.matchCommand_(params.commandName);
          if (command) {
            commandName = command.name;
            if (command.excludeFromCommandHistory) {
              commandHistoryRegister.setText(previousCommand);
            }
            this.parseCommandArgs_(inputStream, params, command);
            if (command.type == 'exToKey') {
              // Handle Ex to Key mapping.
              for (var i = 0; i < command.toKeys.length; i++) {
                CodeMirror.Vim.handleKey(cm, command.toKeys[i], 'mapping');
              }
              return;
            } else if (command.type == 'exToEx') {
              // Handle Ex to Ex mapping.
              this.processCommand(cm, command.toInput);
              return;
            }
          }
        }
        if (!commandName) {
          showConfirm(cm, 'Not an editor command ":' + input + '"');
          return;
        }
        try {
          exCommands[commandName](cm, params);
          // Possibly asynchronous commands (e.g. substitute, which might have a
          // user confirmation), are responsible for calling the callback when
          // done. All others have it taken care of for them here.
          if ((!command || !command.possiblyAsync) && params.callback) {
            params.callback();
          }
        } catch(e) {
          showConfirm(cm, e);
          throw e;
        }
      },
      parseInput_: function(cm, inputStream, result) {
        inputStream.eatWhile(':');
        // Parse range.
        if (inputStream.eat('%')) {
          result.line = cm.firstLine();
          result.lineEnd = cm.lastLine();
        } else {
          result.line = this.parseLineSpec_(cm, inputStream);
          if (result.line !== undefined && inputStream.eat(',')) {
            result.lineEnd = this.parseLineSpec_(cm, inputStream);
          }
        }

        // Parse command name.
        var commandMatch = inputStream.match(/^(\w+)/);
        if (commandMatch) {
          result.commandName = commandMatch[1];
        } else {
          result.commandName = inputStream.match(/.*/)[0];
        }

        return result;
      },
      parseLineSpec_: function(cm, inputStream) {
        var numberMatch = inputStream.match(/^(\d+)/);
        if (numberMatch) {
          // Absolute line number plus offset (N+M or N-M) is probably a typo,
          // not something the user actually wanted. (NB: vim does allow this.)
          return parseInt(numberMatch[1], 10) - 1;
        }
        switch (inputStream.next()) {
          case '.':
            return this.parseLineSpecOffset_(inputStream, cm.getCursor().line);
          case '$':
            return this.parseLineSpecOffset_(inputStream, cm.lastLine());
          case '\'':
            var markName = inputStream.next();
            var markPos = getMarkPos(cm, cm.state.vim, markName);
            if (!markPos) throw new Error('Mark not set');
            return this.parseLineSpecOffset_(inputStream, markPos.line);
          case '-':
          case '+':
            inputStream.backUp(1);
            // Offset is relative to current line if not otherwise specified.
            return this.parseLineSpecOffset_(inputStream, cm.getCursor().line);
          default:
            inputStream.backUp(1);
            return undefined;
        }
      },
      parseLineSpecOffset_: function(inputStream, line) {
        var offsetMatch = inputStream.match(/^([+-])?(\d+)/);
        if (offsetMatch) {
          var offset = parseInt(offsetMatch[2], 10);
          if (offsetMatch[1] == "-") {
            line -= offset;
          } else {
            line += offset;
          }
        }
        return line;
      },
      parseCommandArgs_: function(inputStream, params, command) {
        if (inputStream.eol()) {
          return;
        }
        params.argString = inputStream.match(/.*/)[0];
        // Parse command-line arguments
        var delim = command.argDelimiter || /\s+/;
        var args = trim(params.argString).split(delim);
        if (args.length && args[0]) {
          params.args = args;
        }
      },
      matchCommand_: function(commandName) {
        // Return the command in the command map that matches the shortest
        // prefix of the passed in command name. The match is guaranteed to be
        // unambiguous if the defaultExCommandMap's shortNames are set up
        // correctly. (see @code{defaultExCommandMap}).
        for (var i = commandName.length; i > 0; i--) {
          var prefix = commandName.substring(0, i);
          if (this.commandMap_[prefix]) {
            var command = this.commandMap_[prefix];
            if (command.name.indexOf(commandName) === 0) {
              return command;
            }
          }
        }
        return null;
      },
      buildCommandMap_: function() {
        this.commandMap_ = {};
        for (var i = 0; i < defaultExCommandMap.length; i++) {
          var command = defaultExCommandMap[i];
          var key = command.shortName || command.name;
          this.commandMap_[key] = command;
        }
      },
      map: function(lhs, rhs, ctx) {
        if (lhs != ':' && lhs.charAt(0) == ':') {
          if (ctx) { throw Error('Mode not supported for ex mappings'); }
          var commandName = lhs.substring(1);
          if (rhs != ':' && rhs.charAt(0) == ':') {
            // Ex to Ex mapping
            this.commandMap_[commandName] = {
              name: commandName,
              type: 'exToEx',
              toInput: rhs.substring(1),
              user: true
            };
          } else {
            // Ex to key mapping
            this.commandMap_[commandName] = {
              name: commandName,
              type: 'exToKey',
              toKeys: rhs,
              user: true
            };
          }
        } else {
          if (rhs != ':' && rhs.charAt(0) == ':') {
            // Key to Ex mapping.
            var mapping = {
              keys: lhs,
              type: 'keyToEx',
              exArgs: { input: rhs.substring(1) }
            };
            if (ctx) { mapping.context = ctx; }
            defaultKeymap.unshift(mapping);
          } else {
            // Key to key mapping
            var mapping = {
              keys: lhs,
              type: 'keyToKey',
              toKeys: rhs
            };
            if (ctx) { mapping.context = ctx; }
            defaultKeymap.unshift(mapping);
          }
        }
      },
      unmap: function(lhs, ctx) {
        if (lhs != ':' && lhs.charAt(0) == ':') {
          // Ex to Ex or Ex to key mapping
          if (ctx) { throw Error('Mode not supported for ex mappings'); }
          var commandName = lhs.substring(1);
          if (this.commandMap_[commandName] && this.commandMap_[commandName].user) {
            delete this.commandMap_[commandName];
            return;
          }
        } else {
          // Key to Ex or key to key mapping
          var keys = lhs;
          for (var i = 0; i < defaultKeymap.length; i++) {
            if (keys == defaultKeymap[i].keys
                && defaultKeymap[i].context === ctx) {
              defaultKeymap.splice(i, 1);
              return;
            }
          }
        }
        throw Error('No such mapping.');
      }
    };

    var exCommands = {
      colorscheme: function(cm, params) {
        if (!params.args || params.args.length < 1) {
          showConfirm(cm, cm.getOption('theme'));
          return;
        }
        cm.setOption('theme', params.args[0]);
      },
      map: function(cm, params, ctx) {
        var mapArgs = params.args;
        if (!mapArgs || mapArgs.length < 2) {
          if (cm) {
            showConfirm(cm, 'Invalid mapping: ' + params.input);
          }
          return;
        }
        exCommandDispatcher.map(mapArgs[0], mapArgs[1], ctx);
      },
      imap: function(cm, params) { this.map(cm, params, 'insert'); },
      nmap: function(cm, params) { this.map(cm, params, 'normal'); },
      vmap: function(cm, params) { this.map(cm, params, 'visual'); },
      unmap: function(cm, params, ctx) {
        var mapArgs = params.args;
        if (!mapArgs || mapArgs.length < 1) {
          if (cm) {
            showConfirm(cm, 'No such mapping: ' + params.input);
          }
          return;
        }
        exCommandDispatcher.unmap(mapArgs[0], ctx);
      },
      move: function(cm, params) {
        commandDispatcher.processCommand(cm, cm.state.vim, {
            type: 'motion',
            motion: 'moveToLineOrEdgeOfDocument',
            motionArgs: { forward: false, explicitRepeat: true,
              linewise: true },
            repeatOverride: params.line+1});
      },
      set: function(cm, params) {
        var setArgs = params.args;
        // Options passed through to the setOption/getOption calls. May be passed in by the
        // local/global versions of the set command
        var setCfg = params.setCfg || {};
        if (!setArgs || setArgs.length < 1) {
          if (cm) {
            showConfirm(cm, 'Invalid mapping: ' + params.input);
          }
          return;
        }
        var expr = setArgs[0].split('=');
        var optionName = expr[0];
        var value = expr[1];
        var forceGet = false;

        if (optionName.charAt(optionName.length - 1) == '?') {
          // If post-fixed with ?, then the set is actually a get.
          if (value) { throw Error('Trailing characters: ' + params.argString); }
          optionName = optionName.substring(0, optionName.length - 1);
          forceGet = true;
        }
        if (value === undefined && optionName.substring(0, 2) == 'no') {
          // To set boolean options to false, the option name is prefixed with
          // 'no'.
          optionName = optionName.substring(2);
          value = false;
        }

        var optionIsBoolean = options[optionName] && options[optionName].type == 'boolean';
        if (optionIsBoolean && value == undefined) {
          // Calling set with a boolean option sets it to true.
          value = true;
        }
        // If no value is provided, then we assume this is a get.
        if (!optionIsBoolean && value === undefined || forceGet) {
          var oldValue = getOption(optionName, cm, setCfg);
          if (oldValue instanceof Error) {
            showConfirm(cm, oldValue.message);
          } else if (oldValue === true || oldValue === false) {
            showConfirm(cm, ' ' + (oldValue ? '' : 'no') + optionName);
          } else {
            showConfirm(cm, '  ' + optionName + '=' + oldValue);
          }
        } else {
          var setOptionReturn = setOption(optionName, value, cm, setCfg);
          if (setOptionReturn instanceof Error) {
            showConfirm(cm, setOptionReturn.message);
          }
        }
      },
      setlocal: function (cm, params) {
        // setCfg is passed through to setOption
        params.setCfg = {scope: 'local'};
        this.set(cm, params);
      },
      setglobal: function (cm, params) {
        // setCfg is passed through to setOption
        params.setCfg = {scope: 'global'};
        this.set(cm, params);
      },
      registers: function(cm, params) {
        var regArgs = params.args;
        var registers = vimGlobalState.registerController.registers;
        var regInfo = '----------Registers----------<br><br>';
        if (!regArgs) {
          for (var registerName in registers) {
            var text = registers[registerName].toString();
            if (text.length) {
              regInfo += '"' + registerName + '    ' + text + '<br>';
            }
          }
        } else {
          var registerName;
          regArgs = regArgs.join('');
          for (var i = 0; i < regArgs.length; i++) {
            registerName = regArgs.charAt(i);
            if (!vimGlobalState.registerController.isValidRegister(registerName)) {
              continue;
            }
            var register = registers[registerName] || new Register();
            regInfo += '"' + registerName + '    ' + register.toString() + '<br>';
          }
        }
        showConfirm(cm, regInfo);
      },
      sort: function(cm, params) {
        var reverse, ignoreCase, unique, number, pattern;
        function parseArgs() {
          if (params.argString) {
            var args = new CodeMirror.StringStream(params.argString);
            if (args.eat('!')) { reverse = true; }
            if (args.eol()) { return; }
            if (!args.eatSpace()) { return 'Invalid arguments'; }
            var opts = args.match(/([dinuox]+)?\s*(\/.+\/)?\s*/);
            if (!opts && !args.eol()) { return 'Invalid arguments'; }
            if (opts[1]) {
              ignoreCase = opts[1].indexOf('i') != -1;
              unique = opts[1].indexOf('u') != -1;
              var decimal = opts[1].indexOf('d') != -1 || opts[1].indexOf('n') != -1 && 1;
              var hex = opts[1].indexOf('x') != -1 && 1;
              var octal = opts[1].indexOf('o') != -1 && 1;
              if (decimal + hex + octal > 1) { return 'Invalid arguments'; }
              number = decimal && 'decimal' || hex && 'hex' || octal && 'octal';
            }
            if (opts[2]) {
              pattern = new RegExp(opts[2].substr(1, opts[2].length - 2), ignoreCase ? 'i' : '');
            }
          }
        }
        var err = parseArgs();
        if (err) {
          showConfirm(cm, err + ': ' + params.argString);
          return;
        }
        var lineStart = params.line || cm.firstLine();
        var lineEnd = params.lineEnd || params.line || cm.lastLine();
        if (lineStart == lineEnd) { return; }
        var curStart = Pos(lineStart, 0);
        var curEnd = Pos(lineEnd, lineLength(cm, lineEnd));
        var text = cm.getRange(curStart, curEnd).split('\n');
        var numberRegex = pattern ? pattern :
           (number == 'decimal') ? /(-?)([\d]+)/ :
           (number == 'hex') ? /(-?)(?:0x)?([0-9a-f]+)/i :
           (number == 'octal') ? /([0-7]+)/ : null;
        var radix = (number == 'decimal') ? 10 : (number == 'hex') ? 16 : (number == 'octal') ? 8 : null;
        var numPart = [], textPart = [];
        if (number || pattern) {
          for (var i = 0; i < text.length; i++) {
            var matchPart = pattern ? text[i].match(pattern) : null;
            if (matchPart && matchPart[0] != '') {
              numPart.push(matchPart);
            } else if (!pattern && numberRegex.exec(text[i])) {
              numPart.push(text[i]);
            } else {
              textPart.push(text[i]);
            }
          }
        } else {
          textPart = text;
        }
        function compareFn(a, b) {
          if (reverse) { var tmp; tmp = a; a = b; b = tmp; }
          if (ignoreCase) { a = a.toLowerCase(); b = b.toLowerCase(); }
          var anum = number && numberRegex.exec(a);
          var bnum = number && numberRegex.exec(b);
          if (!anum) { return a < b ? -1 : 1; }
          anum = parseInt((anum[1] + anum[2]).toLowerCase(), radix);
          bnum = parseInt((bnum[1] + bnum[2]).toLowerCase(), radix);
          return anum - bnum;
        }
        function comparePatternFn(a, b) {
          if (reverse) { var tmp; tmp = a; a = b; b = tmp; }
          if (ignoreCase) { a[0] = a[0].toLowerCase(); b[0] = b[0].toLowerCase(); }
          return (a[0] < b[0]) ? -1 : 1;
        }
        numPart.sort(pattern ? comparePatternFn : compareFn);
        if (pattern) {
          for (var i = 0; i < numPart.length; i++) {
            numPart[i] = numPart[i].input;
          }
        } else if (!number) { textPart.sort(compareFn); }
        text = (!reverse) ? textPart.concat(numPart) : numPart.concat(textPart);
        if (unique) { // Remove duplicate lines
          var textOld = text;
          var lastLine;
          text = [];
          for (var i = 0; i < textOld.length; i++) {
            if (textOld[i] != lastLine) {
              text.push(textOld[i]);
            }
            lastLine = textOld[i];
          }
        }
        cm.replaceRange(text.join('\n'), curStart, curEnd);
      },
      global: function(cm, params) {
        // a global command is of the form
        // :[range]g/pattern/[cmd]
        // argString holds the string /pattern/[cmd]
        var argString = params.argString;
        if (!argString) {
          showConfirm(cm, 'Regular Expression missing from global');
          return;
        }
        // range is specified here
        var lineStart = (params.line !== undefined) ? params.line : cm.firstLine();
        var lineEnd = params.lineEnd || params.line || cm.lastLine();
        // get the tokens from argString
        var tokens = splitBySlash(argString);
        var regexPart = argString, cmd;
        if (tokens.length) {
          regexPart = tokens[0];
          cmd = tokens.slice(1, tokens.length).join('/');
        }
        if (regexPart) {
          // If regex part is empty, then use the previous query. Otherwise
          // use the regex part as the new query.
          try {
           updateSearchQuery(cm, regexPart, true /** ignoreCase */,
             true /** smartCase */);
          } catch (e) {
           showConfirm(cm, 'Invalid regex: ' + regexPart);
           return;
          }
        }
        // now that we have the regexPart, search for regex matches in the
        // specified range of lines
        var query = getSearchState(cm).getQuery();
        var matchedLines = [], content = '';
        for (var i = lineStart; i <= lineEnd; i++) {
          var matched = query.test(cm.getLine(i));
          if (matched) {
            matchedLines.push(i+1);
            content+= cm.getLine(i) + '<br>';
          }
        }
        // if there is no [cmd], just display the list of matched lines
        if (!cmd) {
          showConfirm(cm, content);
          return;
        }
        var index = 0;
        var nextCommand = function() {
          if (index < matchedLines.length) {
            var command = matchedLines[index] + cmd;
            exCommandDispatcher.processCommand(cm, command, {
              callback: nextCommand
            });
          }
          index++;
        };
        nextCommand();
      },
      substitute: function(cm, params) {
        if (!cm.getSearchCursor) {
          throw new Error('Search feature not available. Requires searchcursor.js or ' +
              'any other getSearchCursor implementation.');
        }
        var argString = params.argString;
        var tokens = argString ? splitBySeparator(argString, argString[0]) : [];
        var regexPart, replacePart = '', trailing, flagsPart, count;
        var confirm = false; // Whether to confirm each replace.
        var global = false; // True to replace all instances on a line, false to replace only 1.
        if (tokens.length) {
          regexPart = tokens[0];
          if (getOption('pcre') && regexPart !== '') {
              regexPart = new RegExp(regexPart).source; //normalize not escaped characters
          }
          replacePart = tokens[1];
          if (regexPart && regexPart[regexPart.length - 1] === '$') {
            regexPart = regexPart.slice(0, regexPart.length - 1) + '\\n';
            replacePart = replacePart ? replacePart + '\n' : '\n';
          }
          if (replacePart !== undefined) {
            if (getOption('pcre')) {
              replacePart = unescapeRegexReplace(replacePart.replace(/([^\\])&/g,"$1$$&"));
            } else {
              replacePart = translateRegexReplace(replacePart);
            }
            vimGlobalState.lastSubstituteReplacePart = replacePart;
          }
          trailing = tokens[2] ? tokens[2].split(' ') : [];
        } else {
          // either the argString is empty or its of the form ' hello/world'
          // actually splitBySlash returns a list of tokens
          // only if the string starts with a '/'
          if (argString && argString.length) {
            showConfirm(cm, 'Substitutions should be of the form ' +
                ':s/pattern/replace/');
            return;
          }
        }
        // After the 3rd slash, we can have flags followed by a space followed
        // by count.
        if (trailing) {
          flagsPart = trailing[0];
          count = parseInt(trailing[1]);
          if (flagsPart) {
            if (flagsPart.indexOf('c') != -1) {
              confirm = true;
              flagsPart.replace('c', '');
            }
            if (flagsPart.indexOf('g') != -1) {
              global = true;
              flagsPart.replace('g', '');
            }
            if (getOption('pcre')) {
               regexPart = regexPart + '/' + flagsPart;
            } else {
               regexPart = regexPart.replace(/\//g, "\\/") + '/' + flagsPart;
            }
          }
        }
        if (regexPart) {
          // If regex part is empty, then use the previous query. Otherwise use
          // the regex part as the new query.
          try {
            updateSearchQuery(cm, regexPart, true /** ignoreCase */,
              true /** smartCase */);
          } catch (e) {
            showConfirm(cm, 'Invalid regex: ' + regexPart);
            return;
          }
        }
        replacePart = replacePart || vimGlobalState.lastSubstituteReplacePart;
        if (replacePart === undefined) {
          showConfirm(cm, 'No previous substitute regular expression');
          return;
        }
        var state = getSearchState(cm);
        var query = state.getQuery();
        var lineStart = (params.line !== undefined) ? params.line : cm.getCursor().line;
        var lineEnd = params.lineEnd || lineStart;
        if (lineStart == cm.firstLine() && lineEnd == cm.lastLine()) {
          lineEnd = Infinity;
        }
        if (count) {
          lineStart = lineEnd;
          lineEnd = lineStart + count - 1;
        }
        var startPos = clipCursorToContent(cm, Pos(lineStart, 0));
        var cursor = cm.getSearchCursor(query, startPos);
        doReplace(cm, confirm, global, lineStart, lineEnd, cursor, query, replacePart, params.callback);
      },
      redo: CodeMirror.commands.redo,
      undo: CodeMirror.commands.undo,
      write: function(cm) {
        if (CodeMirror.commands.save) {
          // If a save command is defined, call it.
          CodeMirror.commands.save(cm);
        } else if (cm.save) {
          // Saves to text area if no save command is defined and cm.save() is available.
          cm.save();
        }
      },
      nohlsearch: function(cm) {
        clearSearchHighlight(cm);
      },
      yank: function (cm) {
        var cur = copyCursor(cm.getCursor());
        var line = cur.line;
        var lineText = cm.getLine(line);
        vimGlobalState.registerController.pushText(
          '0', 'yank', lineText, true, true);
      },
      delmarks: function(cm, params) {
        if (!params.argString || !trim(params.argString)) {
          showConfirm(cm, 'Argument required');
          return;
        }

        var state = cm.state.vim;
        var stream = new CodeMirror.StringStream(trim(params.argString));
        while (!stream.eol()) {
          stream.eatSpace();

          // Record the streams position at the beginning of the loop for use
          // in error messages.
          var count = stream.pos;

          if (!stream.match(/[a-zA-Z]/, false)) {
            showConfirm(cm, 'Invalid argument: ' + params.argString.substring(count));
            return;
          }

          var sym = stream.next();
          // Check if this symbol is part of a range
          if (stream.match('-', true)) {
            // This symbol is part of a range.

            // The range must terminate at an alphabetic character.
            if (!stream.match(/[a-zA-Z]/, false)) {
              showConfirm(cm, 'Invalid argument: ' + params.argString.substring(count));
              return;
            }

            var startMark = sym;
            var finishMark = stream.next();
            // The range must terminate at an alphabetic character which
            // shares the same case as the start of the range.
            if (isLowerCase(startMark) && isLowerCase(finishMark) ||
                isUpperCase(startMark) && isUpperCase(finishMark)) {
              var start = startMark.charCodeAt(0);
              var finish = finishMark.charCodeAt(0);
              if (start >= finish) {
                showConfirm(cm, 'Invalid argument: ' + params.argString.substring(count));
                return;
              }

              // Because marks are always ASCII values, and we have
              // determined that they are the same case, we can use
              // their char codes to iterate through the defined range.
              for (var j = 0; j <= finish - start; j++) {
                var mark = String.fromCharCode(start + j);
                delete state.marks[mark];
              }
            } else {
              showConfirm(cm, 'Invalid argument: ' + startMark + '-');
              return;
            }
          } else {
            // This symbol is a valid mark, and is not part of a range.
            delete state.marks[sym];
          }
        }
      }
    };

    var exCommandDispatcher = new ExCommandDispatcher();

    /**
    * @param {CodeMirror} cm CodeMirror instance we are in.
    * @param {boolean} confirm Whether to confirm each replace.
    * @param {Cursor} lineStart Line to start replacing from.
    * @param {Cursor} lineEnd Line to stop replacing at.
    * @param {RegExp} query Query for performing matches with.
    * @param {string} replaceWith Text to replace matches with. May contain $1,
    *     $2, etc for replacing captured groups using Javascript replace.
    * @param {function()} callback A callback for when the replace is done.
    */
    function doReplace(cm, confirm, global, lineStart, lineEnd, searchCursor, query,
        replaceWith, callback) {
      // Set up all the functions.
      cm.state.vim.exMode = true;
      var done = false;
      var lastPos = searchCursor.from();
      function replaceAll() {
        cm.operation(function() {
          while (!done) {
            replace();
            next();
          }
          stop();
        });
      }
      function replace() {
        var text = cm.getRange(searchCursor.from(), searchCursor.to());
        var newText = text.replace(query, replaceWith);
        searchCursor.replace(newText);
      }
      function next() {
        // The below only loops to skip over multiple occurrences on the same
        // line when 'global' is not true.
        while(searchCursor.findNext() &&
              isInRange(searchCursor.from(), lineStart, lineEnd)) {
          if (!global && lastPos && searchCursor.from().line == lastPos.line) {
            continue;
          }
          cm.scrollIntoView(searchCursor.from(), 30);
          cm.setSelection(searchCursor.from(), searchCursor.to());
          lastPos = searchCursor.from();
          done = false;
          return;
        }
        done = true;
      }
      function stop(close) {
        if (close) { close(); }
        cm.focus();
        if (lastPos) {
          cm.setCursor(lastPos);
          var vim = cm.state.vim;
          vim.exMode = false;
          vim.lastHPos = vim.lastHSPos = lastPos.ch;
        }
        if (callback) { callback(); }
      }
      function onPromptKeyDown(e, _value, close) {
        // Swallow all keys.
        CodeMirror.e_stop(e);
        var keyName = CodeMirror.keyName(e);
        switch (keyName) {
          case 'Y':
            replace(); next(); break;
          case 'N':
            next(); break;
          case 'A':
            // replaceAll contains a call to close of its own. We don't want it
            // to fire too early or multiple times.
            var savedCallback = callback;
            callback = undefined;
            cm.operation(replaceAll);
            callback = savedCallback;
            break;
          case 'L':
            replace();
            // fall through and exit.
          case 'Q':
          case 'Esc':
          case 'Ctrl-C':
          case 'Ctrl-[':
            stop(close);
            break;
        }
        if (done) { stop(close); }
        return true;
      }

      // Actually do replace.
      next();
      if (done) {
        showConfirm(cm, 'No matches for ' + query.source);
        return;
      }
      if (!confirm) {
        replaceAll();
        if (callback) { callback(); }
        return;
      }
      showPrompt(cm, {
        prefix: 'replace with <strong>' + replaceWith + '</strong> (y/n/a/q/l)',
        onKeyDown: onPromptKeyDown
      });
    }

    CodeMirror.keyMap.vim = {
      attach: attachVimMap,
      detach: detachVimMap,
      call: cmKey
    };

    function exitInsertMode(cm) {
      var vim = cm.state.vim;
      var macroModeState = vimGlobalState.macroModeState;
      var insertModeChangeRegister = vimGlobalState.registerController.getRegister('.');
      var isPlaying = macroModeState.isPlaying;
      var lastChange = macroModeState.lastInsertModeChanges;
      if (!isPlaying) {
        cm.off('change', onChange);
        CodeMirror.off(cm.getInputField(), 'keydown', onKeyEventTargetKeyDown);
      }
      if (!isPlaying && vim.insertModeRepeat > 1) {
        // Perform insert mode repeat for commands like 3,a and 3,o.
        repeatLastEdit(cm, vim, vim.insertModeRepeat - 1,
            true /** repeatForInsert */);
        vim.lastEditInputState.repeatOverride = vim.insertModeRepeat;
      }
      delete vim.insertModeRepeat;
      vim.insertMode = false;
      cm.setCursor(cm.getCursor().line, cm.getCursor().ch-1);
      cm.setOption('keyMap', 'vim');
      cm.setOption('disableInput', true);
      cm.toggleOverwrite(false); // exit replace mode if we were in it.
      // update the ". register before exiting insert mode
      insertModeChangeRegister.setText(lastChange.changes.join(''));
      CodeMirror.signal(cm, "vim-mode-change", {mode: "normal"});
      if (macroModeState.isRecording) {
        logInsertModeChange(macroModeState);
      }
    }

    function _mapCommand(command) {
      defaultKeymap.unshift(command);
    }

    function mapCommand(keys, type, name, args, extra) {
      var command = {keys: keys, type: type};
      command[type] = name;
      command[type + "Args"] = args;
      for (var key in extra)
        command[key] = extra[key];
      _mapCommand(command);
    }

    // The timeout in milliseconds for the two-character ESC keymap should be
    // adjusted according to your typing speed to prevent false positives.
    defineOption('insertModeEscKeysTimeout', 200, 'number');

    CodeMirror.keyMap['vim-insert'] = {
      // TODO: override navigation keys so that Esc will cancel automatic
      // indentation from o, O, i_<CR>
      fallthrough: ['default'],
      attach: attachVimMap,
      detach: detachVimMap,
      call: cmKey
    };

    CodeMirror.keyMap['vim-replace'] = {
      'Backspace': 'goCharLeft',
      fallthrough: ['vim-insert'],
      attach: attachVimMap,
      detach: detachVimMap,
      call: cmKey
    };

    function executeMacroRegister(cm, vim, macroModeState, registerName) {
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (registerName == ':') {
        // Read-only register containing last Ex command.
        if (register.keyBuffer[0]) {
          exCommandDispatcher.processCommand(cm, register.keyBuffer[0]);
        }
        macroModeState.isPlaying = false;
        return;
      }
      var keyBuffer = register.keyBuffer;
      var imc = 0;
      macroModeState.isPlaying = true;
      macroModeState.replaySearchQueries = register.searchQueries.slice(0);
      for (var i = 0; i < keyBuffer.length; i++) {
        var text = keyBuffer[i];
        var match, key;
        while (text) {
          // Pull off one command key, which is either a single character
          // or a special sequence wrapped in '<' and '>', e.g. '<Space>'.
          match = (/<\w+-.+?>|<\w+>|./).exec(text);
          key = match[0];
          text = text.substring(match.index + key.length);
          CodeMirror.Vim.handleKey(cm, key, 'macro');
          if (vim.insertMode) {
            var changes = register.insertModeChanges[imc++].changes;
            vimGlobalState.macroModeState.lastInsertModeChanges.changes =
                changes;
            repeatInsertModeChanges(cm, changes, 1);
            exitInsertMode(cm);
          }
        }
      }
      macroModeState.isPlaying = false;
    }

    function logKey(macroModeState, key) {
      if (macroModeState.isPlaying) { return; }
      var registerName = macroModeState.latestRegister;
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (register) {
        register.pushText(key);
      }
    }

    function logInsertModeChange(macroModeState) {
      if (macroModeState.isPlaying) { return; }
      var registerName = macroModeState.latestRegister;
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (register && register.pushInsertModeChanges) {
        register.pushInsertModeChanges(macroModeState.lastInsertModeChanges);
      }
    }

    function logSearchQuery(macroModeState, query) {
      if (macroModeState.isPlaying) { return; }
      var registerName = macroModeState.latestRegister;
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (register && register.pushSearchQuery) {
        register.pushSearchQuery(query);
      }
    }

    /**
     * Listens for changes made in insert mode.
     * Should only be active in insert mode.
     */
    function onChange(cm, changeObj) {
      var macroModeState = vimGlobalState.macroModeState;
      var lastChange = macroModeState.lastInsertModeChanges;
      if (!macroModeState.isPlaying) {
        while(changeObj) {
          lastChange.expectCursorActivityForChange = true;
          if (lastChange.ignoreCount > 1) {
            lastChange.ignoreCount--;
          } else if (changeObj.origin == '+input' || changeObj.origin == 'paste'
              || changeObj.origin === undefined /* only in testing */) {
            var selectionCount = cm.listSelections().length;
            if (selectionCount > 1)
              lastChange.ignoreCount = selectionCount;
            var text = changeObj.text.join('\n');
            if (lastChange.maybeReset) {
              lastChange.changes = [];
              lastChange.maybeReset = false;
            }
            if (text) {
              if (cm.state.overwrite && !/\n/.test(text)) {
                lastChange.changes.push([text]);
              } else {
                lastChange.changes.push(text);
              }
            }
          }
          // Change objects may be chained with next.
          changeObj = changeObj.next;
        }
      }
    }

    /**
    * Listens for any kind of cursor activity on CodeMirror.
    */
    function onCursorActivity(cm) {
      var vim = cm.state.vim;
      if (vim.insertMode) {
        // Tracking cursor activity in insert mode (for macro support).
        var macroModeState = vimGlobalState.macroModeState;
        if (macroModeState.isPlaying) { return; }
        var lastChange = macroModeState.lastInsertModeChanges;
        if (lastChange.expectCursorActivityForChange) {
          lastChange.expectCursorActivityForChange = false;
        } else {
          // Cursor moved outside the context of an edit. Reset the change.
          lastChange.maybeReset = true;
        }
      } else if (!cm.curOp.isVimOp) {
        handleExternalSelection(cm, vim);
      }
      if (vim.visualMode) {
        updateFakeCursor(cm);
      }
    }
    function updateFakeCursor(cm) {
      var vim = cm.state.vim;
      var from = clipCursorToContent(cm, copyCursor(vim.sel.head));
      var to = offsetCursor(from, 0, 1);
      if (vim.fakeCursor) {
        vim.fakeCursor.clear();
      }
      vim.fakeCursor = cm.markText(from, to, {className: 'cm-animate-fat-cursor'});
    }
    function handleExternalSelection(cm, vim) {
      var anchor = cm.getCursor('anchor');
      var head = cm.getCursor('head');
      // Enter or exit visual mode to match mouse selection.
      if (vim.visualMode && !cm.somethingSelected()) {
        exitVisualMode(cm, false);
      } else if (!vim.visualMode && !vim.insertMode && cm.somethingSelected()) {
        vim.visualMode = true;
        vim.visualLine = false;
        CodeMirror.signal(cm, "vim-mode-change", {mode: "visual"});
      }
      if (vim.visualMode) {
        // Bind CodeMirror selection model to vim selection model.
        // Mouse selections are considered visual characterwise.
        var headOffset = !cursorIsBefore(head, anchor) ? -1 : 0;
        var anchorOffset = cursorIsBefore(head, anchor) ? -1 : 0;
        head = offsetCursor(head, 0, headOffset);
        anchor = offsetCursor(anchor, 0, anchorOffset);
        vim.sel = {
          anchor: anchor,
          head: head
        };
        updateMark(cm, vim, '<', cursorMin(head, anchor));
        updateMark(cm, vim, '>', cursorMax(head, anchor));
      } else if (!vim.insertMode) {
        // Reset lastHPos if selection was modified by something outside of vim mode e.g. by mouse.
        vim.lastHPos = cm.getCursor().ch;
      }
    }

    /** Wrapper for special keys pressed in insert mode */
    function InsertModeKey(keyName) {
      this.keyName = keyName;
    }

    /**
    * Handles raw key down events from the text area.
    * - Should only be active in insert mode.
    * - For recording deletes in insert mode.
    */
    function onKeyEventTargetKeyDown(e) {
      var macroModeState = vimGlobalState.macroModeState;
      var lastChange = macroModeState.lastInsertModeChanges;
      var keyName = CodeMirror.keyName(e);
      if (!keyName) { return; }
      function onKeyFound() {
        if (lastChange.maybeReset) {
          lastChange.changes = [];
          lastChange.maybeReset = false;
        }
        lastChange.changes.push(new InsertModeKey(keyName));
        return true;
      }
      if (keyName.indexOf('Delete') != -1 || keyName.indexOf('Backspace') != -1) {
        CodeMirror.lookupKey(keyName, 'vim-insert', onKeyFound);
      }
    }

    /**
     * Repeats the last edit, which includes exactly 1 command and at most 1
     * insert. Operator and motion commands are read from lastEditInputState,
     * while action commands are read from lastEditActionCommand.
     *
     * If repeatForInsert is true, then the function was called by
     * exitInsertMode to repeat the insert mode changes the user just made. The
     * corresponding enterInsertMode call was made with a count.
     */
    function repeatLastEdit(cm, vim, repeat, repeatForInsert) {
      var macroModeState = vimGlobalState.macroModeState;
      macroModeState.isPlaying = true;
      var isAction = !!vim.lastEditActionCommand;
      var cachedInputState = vim.inputState;
      function repeatCommand() {
        if (isAction) {
          commandDispatcher.processAction(cm, vim, vim.lastEditActionCommand);
        } else {
          commandDispatcher.evalInput(cm, vim);
        }
      }
      function repeatInsert(repeat) {
        if (macroModeState.lastInsertModeChanges.changes.length > 0) {
          // For some reason, repeat cw in desktop VIM does not repeat
          // insert mode changes. Will conform to that behavior.
          repeat = !vim.lastEditActionCommand ? 1 : repeat;
          var changeObject = macroModeState.lastInsertModeChanges;
          repeatInsertModeChanges(cm, changeObject.changes, repeat);
        }
      }
      vim.inputState = vim.lastEditInputState;
      if (isAction && vim.lastEditActionCommand.interlaceInsertRepeat) {
        // o and O repeat have to be interlaced with insert repeats so that the
        // insertions appear on separate lines instead of the last line.
        for (var i = 0; i < repeat; i++) {
          repeatCommand();
          repeatInsert(1);
        }
      } else {
        if (!repeatForInsert) {
          // Hack to get the cursor to end up at the right place. If I is
          // repeated in insert mode repeat, cursor will be 1 insert
          // change set left of where it should be.
          repeatCommand();
        }
        repeatInsert(repeat);
      }
      vim.inputState = cachedInputState;
      if (vim.insertMode && !repeatForInsert) {
        // Don't exit insert mode twice. If repeatForInsert is set, then we
        // were called by an exitInsertMode call lower on the stack.
        exitInsertMode(cm);
      }
      macroModeState.isPlaying = false;
    }

    function repeatInsertModeChanges(cm, changes, repeat) {
      function keyHandler(binding) {
        if (typeof binding == 'string') {
          CodeMirror.commands[binding](cm);
        } else {
          binding(cm);
        }
        return true;
      }
      var head = cm.getCursor('head');
      var visualBlock = vimGlobalState.macroModeState.lastInsertModeChanges.visualBlock;
      if (visualBlock) {
        // Set up block selection again for repeating the changes.
        selectForInsert(cm, head, visualBlock + 1);
        repeat = cm.listSelections().length;
        cm.setCursor(head);
      }
      for (var i = 0; i < repeat; i++) {
        if (visualBlock) {
          cm.setCursor(offsetCursor(head, i, 0));
        }
        for (var j = 0; j < changes.length; j++) {
          var change = changes[j];
          if (change instanceof InsertModeKey) {
            CodeMirror.lookupKey(change.keyName, 'vim-insert', keyHandler);
          } else if (typeof change == "string") {
            var cur = cm.getCursor();
            cm.replaceRange(change, cur, cur);
          } else {
            var start = cm.getCursor();
            var end = offsetCursor(start, 0, change[0].length);
            cm.replaceRange(change[0], start, end);
          }
        }
      }
      if (visualBlock) {
        cm.setCursor(offsetCursor(head, 0, 1));
      }
    }

    resetVimGlobalState();
    return vimApi;
  };
  // Initialize Vim and make it available as an API.
  CodeMirror.Vim = Vim();
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29kZW1pcnJvci9rZXltYXAvdmltLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFLEdBQUc7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU0sSUFBdUQ7QUFDN0QsUUFBUSxtQkFBTyxDQUFDLCtCQUFtQixHQUFHLG1CQUFPLENBQUMsMENBQThCLEdBQUcsbUJBQU8sQ0FBQyxvQ0FBd0IsR0FBRyxtQkFBTyxDQUFDLDRDQUFnQztBQUMxSixPQUFPLEVBR2E7QUFDcEIsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUssZ0RBQWdEO0FBQ3JELEtBQUssaURBQWlEO0FBQ3RELEtBQUssOENBQThDO0FBQ25ELEtBQUssZ0RBQWdEO0FBQ3JELEtBQUssaURBQWlEO0FBQ3RELEtBQUssZ0VBQWdFO0FBQ3JFLEtBQUssaUVBQWlFO0FBQ3RFLEtBQUssbURBQW1EO0FBQ3hELEtBQUssbUVBQW1FO0FBQ3hFLEtBQUssbURBQW1EO0FBQ3hELEtBQUssbUVBQW1FO0FBQ3hFLEtBQUssK0NBQStDO0FBQ3BELEtBQUssK0NBQStDO0FBQ3BELEtBQUssbURBQW1EO0FBQ3hELEtBQUssbURBQW1EO0FBQ3hELEtBQUssc0VBQXNFO0FBQzNFLEtBQUssc0VBQXNFO0FBQzNFLEtBQUssK0RBQStEO0FBQ3BFLEtBQUssNkRBQTZEO0FBQ2xFLEtBQUssK0RBQStEO0FBQ3BFLEtBQUssZ0VBQWdFO0FBQ3JFLEtBQUssZ0RBQWdEO0FBQ3JELEtBQUssK0NBQStDO0FBQ3BELEtBQUssc0RBQXNE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UDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsdUJBQXVCLFFBQVE7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsd0NBQXdDO0FBQ2pGO0FBQ0EseUJBQXlCLHFCQUFxQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsU0FBUztBQUNULGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQixPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSw0QkFBNEI7QUFDNUIscUVBQXFFO0FBQ3JFLFdBQVc7QUFDWCw0QkFBNEI7QUFDNUIsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixtQkFBbUI7QUFDbEQ7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsT0FBTyx1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsNEVBQTRFO0FBQ3BIO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsdUJBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsc0JBQXNCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELGdCQUFnQjtBQUN0RSwrREFBK0QsaUJBQWlCO0FBQ2hGO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0IsK0JBQStCLEtBQUssS0FBSyxLQUFLO0FBQzlDO0FBQ0E7QUFDQSwwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBLFNBQVM7QUFDVCx3QkFBd0I7QUFDeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLHVCQUF1QjtBQUN6RCxXQUFXO0FBQ1g7QUFDQSwrQkFBK0IsOEJBQThCO0FBQzdEO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsZ0JBQWdCO0FBQ3JELE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsY0FBYztBQUM3Qyx5QkFBeUIsWUFBWTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsV0FBVztBQUNYLDJCQUEyQixtQkFBbUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxnQkFBZ0I7QUFDcEUsU0FBUztBQUNUO0FBQ0E7QUFDQSxvREFBb0QsZUFBZTtBQUNuRTtBQUNBLE9BQU87QUFDUDtBQUNBLHVDQUF1QyxRQUFRO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELGdCQUFnQjtBQUNwRSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLG9EQUFvRCxlQUFlO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELDBGQUEwRjtBQUM5STtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsMEZBQTBGO0FBQzlJO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxpQkFBaUI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsNEJBQTRCO0FBQzlELE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsaUJBQWlCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSwyQkFBMkIsaUJBQWlCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isa0NBQWtDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLGtDQUFrQyxRQUFRO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixtQkFBbUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQsVUFBVTtBQUNwRSxpQ0FBaUMsdUJBQXVCO0FBQ3hELDhCQUE4QixvQkFBb0I7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLFVBQVU7QUFDbkMsT0FBTztBQUNQO0FBQ0EsMEJBQTBCLFVBQVU7QUFDcEMsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxrQkFBa0I7QUFDbEQscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixZQUFZO0FBQ2pDO0FBQ0Esa0JBQWtCLGlDQUFpQztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLG1CQUFtQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHVCQUF1QjtBQUNsRTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMkJBQTJCO0FBQy9DO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDJCQUEyQjtBQUMvQztBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsZUFBZTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxzREFBc0Q7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsYUFBYTtBQUM5Qzs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyREFBMkQsT0FBTztBQUNsRSxzREFBc0QsU0FBUztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxPQUFPO0FBQ3pFO0FBQ0E7QUFDQSxrRUFBa0UsU0FBUztBQUMzRSx1QkFBdUIsbUJBQW1CO0FBQzFDO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMENBQTBDLGdCQUFnQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHNFQUFzRSxNQUFNO0FBQzVFLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsTUFBTTtBQUNyRCwrQ0FBK0MsTUFBTSxNQUFNO0FBQzNELFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsYUFBYSxLQUFLLEdBQUcsSUFBSSxhQUFhLEtBQUssR0FBRztBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGFBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVc7QUFDMUIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGdCQUFnQixPQUFPLHNDQUFzQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsb0NBQW9DO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxXQUFXO0FBQzFCLGVBQWUsSUFBSTtBQUNuQixlQUFlLElBQUk7QUFDbkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFlBQVk7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCLHdCQUF3QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFlBQVk7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix1QkFBdUI7QUFDbEQ7QUFDQSxrQkFBa0IsdUNBQXVDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLFVBQVU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isb0JBQW9CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsbUJBQW1CO0FBQ3RELFlBQVksbUJBQW1CO0FBQy9CLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0Esd0NBQXdDLE9BQU87QUFDL0M7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFFBQVE7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsT0FBTyxNQUFNLE9BQU87QUFDOUIsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLFVBQVUsS0FBSyxLQUFLLEtBQUs7QUFDekIsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdGQUFnRiw4QkFBOEI7QUFDOUcsNkVBQTZFLDhCQUE4Qjs7QUFFM0c7QUFDQSxnQkFBZ0I7QUFDaEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBLGNBQWM7QUFDZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0IsT0FBTztBQUNQO0FBQ0Esd0JBQXdCLGtCQUFrQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMkMsaUJBQWlCO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixvQkFBb0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBLHNCQUFzQixnQkFBZ0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixnQkFBZ0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxjQUFjO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsNkJBQTZCO0FBQzFELE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGtCQUFrQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxpQ0FBaUMsWUFBWTtBQUM3QztBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBLG1FQUFtRSwyQkFBMkI7QUFDOUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0Msa0RBQWtEO0FBQ2xGO0FBQ0EsOEJBQThCLHFCQUFxQjtBQUNuRCxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLDZDQUE2QztBQUM3QyxTQUFTO0FBQ1Qsc0VBQXNFLGdDQUFnQyxZQUFZLEVBQUU7QUFDcEg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QiwyQkFBMkI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLG9CQUFvQjtBQUNyRCx3Q0FBd0MsT0FBTztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLHVCQUF1QixnQ0FBZ0M7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLG9CQUFvQixtREFBbUQ7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBLHNCQUFzQix1QkFBdUI7QUFDN0M7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHVCQUF1QjtBQUM3QztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1EQUFtRDtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSx5QkFBeUIsMEJBQTBCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxrQ0FBa0MsZ0NBQWdDLEVBQUU7QUFDcEUsa0NBQWtDLGdDQUFnQyxFQUFFO0FBQ3BFLGtDQUFrQyxnQ0FBZ0MsRUFBRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsOEJBQThCO0FBQzlCLDBDQUEwQztBQUMxQyxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0IseURBQXlEO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLHlCQUF5QixvQkFBb0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZ0JBQWdCO0FBQ2hELDZCQUE2QixRQUFRO0FBQ3JDLG1DQUFtQyw0QkFBNEI7QUFDL0Q7QUFDQSx1Q0FBdUMsNEJBQTRCO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4Qyw0QkFBNEI7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxRQUFRO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGlCQUFpQjtBQUMxQztBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixTQUFTLFNBQVMsT0FBTyxTQUFTO0FBQzFELDJCQUEyQixxQkFBcUIscUJBQXFCO0FBQ3JFO0FBQ0E7QUFDQSxzQkFBc0IsdUJBQXVCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsU0FBUyxTQUFTLE9BQU8sU0FBUztBQUMxRCwyQkFBMkIsMkJBQTJCLDJCQUEyQjtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixvQkFBb0I7QUFDN0M7QUFDQTtBQUNBLFNBQVMsb0JBQW9CLDBCQUEwQjtBQUN2RDtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsb0JBQW9CO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsY0FBYztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUIsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHFCQUFxQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGNBQWMsV0FBVztBQUN6QixjQUFjLFFBQVE7QUFDdEIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCO0FBQ0EsY0FBYyxXQUFXO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsUUFBUTtBQUM5QjtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsYUFBYTtBQUNoQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQSxnREFBZ0QsZUFBZTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsc0JBQXNCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxRQUFRO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsbUNBQW1DO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxrREFBa0QsZUFBZTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixRQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixZQUFZO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixvQkFBb0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJmaWxlIjoiMy5iN2E5MmI1MTAwMGQ4ZjUxMDUyNC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvZGVNaXJyb3IsIGNvcHlyaWdodCAoYykgYnkgTWFyaWpuIEhhdmVyYmVrZSBhbmQgb3RoZXJzXG4vLyBEaXN0cmlidXRlZCB1bmRlciBhbiBNSVQgbGljZW5zZTogaHR0cHM6Ly9jb2RlbWlycm9yLm5ldC9MSUNFTlNFXG5cbi8qKlxuICogU3VwcG9ydGVkIGtleWJpbmRpbmdzOlxuICogICBUb28gbWFueSB0byBsaXN0LiBSZWZlciB0byBkZWZhdWx0S2V5bWFwIGJlbG93LlxuICpcbiAqIFN1cHBvcnRlZCBFeCBjb21tYW5kczpcbiAqICAgUmVmZXIgdG8gZGVmYXVsdEV4Q29tbWFuZE1hcCBiZWxvdy5cbiAqXG4gKiBSZWdpc3RlcnM6IHVubmFtZWQsIC0sIGEteiwgQS1aLCAwLTlcbiAqICAgKERvZXMgbm90IHJlc3BlY3QgdGhlIHNwZWNpYWwgY2FzZSBmb3IgbnVtYmVyIHJlZ2lzdGVycyB3aGVuIGRlbGV0ZVxuICogICAgb3BlcmF0b3IgaXMgbWFkZSB3aXRoIHRoZXNlIGNvbW1hbmRzOiAlLCAoLCApLCAgLCAvLCA/LCBuLCBOLCB7LCB9IClcbiAqICAgVE9ETzogSW1wbGVtZW50IHRoZSByZW1haW5pbmcgcmVnaXN0ZXJzLlxuICpcbiAqIE1hcmtzOiBhLXosIEEtWiwgYW5kIDAtOVxuICogICBUT0RPOiBJbXBsZW1lbnQgdGhlIHJlbWFpbmluZyBzcGVjaWFsIG1hcmtzLiBUaGV5IGhhdmUgbW9yZSBjb21wbGV4XG4gKiAgICAgICBiZWhhdmlvci5cbiAqXG4gKiBFdmVudHM6XG4gKiAgJ3ZpbS1tb2RlLWNoYW5nZScgLSByYWlzZWQgb24gdGhlIGVkaXRvciBhbnl0aW1lIHRoZSBjdXJyZW50IG1vZGUgY2hhbmdlcyxcbiAqICAgICAgICAgICAgICAgICAgICAgIEV2ZW50IG9iamVjdDoge21vZGU6IFwidmlzdWFsXCIsIHN1Yk1vZGU6IFwibGluZXdpc2VcIn1cbiAqXG4gKiBDb2RlIHN0cnVjdHVyZTpcbiAqICAxLiBEZWZhdWx0IGtleW1hcFxuICogIDIuIFZhcmlhYmxlIGRlY2xhcmF0aW9ucyBhbmQgc2hvcnQgYmFzaWMgaGVscGVyc1xuICogIDMuIEluc3RhbmNlIChFeHRlcm5hbCBBUEkpIGltcGxlbWVudGF0aW9uXG4gKiAgNC4gSW50ZXJuYWwgc3RhdGUgdHJhY2tpbmcgb2JqZWN0cyAoaW5wdXQgc3RhdGUsIGNvdW50ZXIpIGltcGxlbWVudGF0aW9uXG4gKiAgICAgYW5kIGluc3RhbnRpYXRpb25cbiAqICA1LiBLZXkgaGFuZGxlciAodGhlIG1haW4gY29tbWFuZCBkaXNwYXRjaGVyKSBpbXBsZW1lbnRhdGlvblxuICogIDYuIE1vdGlvbiwgb3BlcmF0b3IsIGFuZCBhY3Rpb24gaW1wbGVtZW50YXRpb25zXG4gKiAgNy4gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIGtleSBoYW5kbGVyLCBtb3Rpb25zLCBvcGVyYXRvcnMsIGFuZCBhY3Rpb25zXG4gKiAgOC4gU2V0IHVwIFZpbSB0byB3b3JrIGFzIGEga2V5bWFwIGZvciBDb2RlTWlycm9yLlxuICogIDkuIEV4IGNvbW1hbmQgaW1wbGVtZW50YXRpb25zLlxuICovXG5cbihmdW5jdGlvbihtb2QpIHtcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZSA9PSBcIm9iamVjdFwiKSAvLyBDb21tb25KU1xuICAgIG1vZChyZXF1aXJlKFwiLi4vbGliL2NvZGVtaXJyb3JcIiksIHJlcXVpcmUoXCIuLi9hZGRvbi9zZWFyY2gvc2VhcmNoY3Vyc29yXCIpLCByZXF1aXJlKFwiLi4vYWRkb24vZGlhbG9nL2RpYWxvZ1wiKSwgcmVxdWlyZShcIi4uL2FkZG9uL2VkaXQvbWF0Y2hicmFja2V0cy5qc1wiKSk7XG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIC8vIEFNRFxuICAgIGRlZmluZShbXCIuLi9saWIvY29kZW1pcnJvclwiLCBcIi4uL2FkZG9uL3NlYXJjaC9zZWFyY2hjdXJzb3JcIiwgXCIuLi9hZGRvbi9kaWFsb2cvZGlhbG9nXCIsIFwiLi4vYWRkb24vZWRpdC9tYXRjaGJyYWNrZXRzXCJdLCBtb2QpO1xuICBlbHNlIC8vIFBsYWluIGJyb3dzZXIgZW52XG4gICAgbW9kKENvZGVNaXJyb3IpO1xufSkoZnVuY3Rpb24oQ29kZU1pcnJvcikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGRlZmF1bHRLZXltYXAgPSBbXG4gICAgLy8gS2V5IHRvIGtleSBtYXBwaW5nLiBUaGlzIGdvZXMgZmlyc3QgdG8gbWFrZSBpdCBwb3NzaWJsZSB0byBvdmVycmlkZVxuICAgIC8vIGV4aXN0aW5nIG1hcHBpbmdzLlxuICAgIHsga2V5czogJzxMZWZ0PicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2gnIH0sXG4gICAgeyBrZXlzOiAnPFJpZ2h0PicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2wnIH0sXG4gICAgeyBrZXlzOiAnPFVwPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2snIH0sXG4gICAgeyBrZXlzOiAnPERvd24+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnaicgfSxcbiAgICB7IGtleXM6ICc8U3BhY2U+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnbCcgfSxcbiAgICB7IGtleXM6ICc8QlM+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnaCcsIGNvbnRleHQ6ICdub3JtYWwnfSxcbiAgICB7IGtleXM6ICc8RGVsPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ3gnLCBjb250ZXh0OiAnbm9ybWFsJ30sXG4gICAgeyBrZXlzOiAnPEMtU3BhY2U+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnVycgfSxcbiAgICB7IGtleXM6ICc8Qy1CUz4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdCJywgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICc8Uy1TcGFjZT4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICd3JyB9LFxuICAgIHsga2V5czogJzxTLUJTPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2InLCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJzxDLW4+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnaicgfSxcbiAgICB7IGtleXM6ICc8Qy1wPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2snIH0sXG4gICAgeyBrZXlzOiAnPEMtWz4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICc8RXNjPicgfSxcbiAgICB7IGtleXM6ICc8Qy1jPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJzxFc2M+JyB9LFxuICAgIHsga2V5czogJzxDLVs+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnPEVzYz4nLCBjb250ZXh0OiAnaW5zZXJ0JyB9LFxuICAgIHsga2V5czogJzxDLWM+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnPEVzYz4nLCBjb250ZXh0OiAnaW5zZXJ0JyB9LFxuICAgIHsga2V5czogJ3MnLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdjbCcsIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAncycsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2MnLCBjb250ZXh0OiAndmlzdWFsJ30sXG4gICAgeyBrZXlzOiAnUycsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2NjJywgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICdTJywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnVmRPJywgY29udGV4dDogJ3Zpc3VhbCcgfSxcbiAgICB7IGtleXM6ICc8SG9tZT4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICcwJyB9LFxuICAgIHsga2V5czogJzxFbmQ+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnJCcgfSxcbiAgICB7IGtleXM6ICc8UGFnZVVwPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJzxDLWI+JyB9LFxuICAgIHsga2V5czogJzxQYWdlRG93bj4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICc8Qy1mPicgfSxcbiAgICB7IGtleXM6ICc8Q1I+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnal4nLCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJzxJbnM+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3RvZ2dsZU92ZXJ3cml0ZScsIGNvbnRleHQ6ICdpbnNlcnQnIH0sXG4gICAgLy8gTW90aW9uc1xuICAgIHsga2V5czogJ0gnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvVG9wTGluZScsIG1vdGlvbkFyZ3M6IHsgbGluZXdpc2U6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnTScsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9NaWRkbGVMaW5lJywgbW90aW9uQXJnczogeyBsaW5ld2lzZTogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdMJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb0JvdHRvbUxpbmUnLCBtb3Rpb25BcmdzOiB7IGxpbmV3aXNlOiB0cnVlLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJ2gnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5Q2hhcmFjdGVycycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAnbCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlDaGFyYWN0ZXJzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlIH19LFxuICAgIHsga2V5czogJ2onLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5TGluZXMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIGxpbmV3aXNlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ2snLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5TGluZXMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBsaW5ld2lzZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdnaicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlEaXNwbGF5TGluZXMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnZ2snLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5RGlzcGxheUxpbmVzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICd3JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVdvcmRzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB3b3JkRW5kOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICdXJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVdvcmRzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB3b3JkRW5kOiBmYWxzZSwgYmlnV29yZDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdlJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVdvcmRzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB3b3JkRW5kOiB0cnVlLCBpbmNsdXNpdmU6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnRScsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlXb3JkcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgd29yZEVuZDogdHJ1ZSwgYmlnV29yZDogdHJ1ZSwgaW5jbHVzaXZlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ2InLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5V29yZHMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCB3b3JkRW5kOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICdCJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVdvcmRzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgd29yZEVuZDogZmFsc2UsIGJpZ1dvcmQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnZ2UnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5V29yZHMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCB3b3JkRW5kOiB0cnVlLCBpbmNsdXNpdmU6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnZ0UnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5V29yZHMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCB3b3JkRW5kOiB0cnVlLCBiaWdXb3JkOiB0cnVlLCBpbmNsdXNpdmU6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAneycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlQYXJhZ3JhcGgnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJ30nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5UGFyYWdyYXBoJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJygnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5U2VudGVuY2UnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJyknLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5U2VudGVuY2UnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnPEMtZj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5UGFnZScsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICc8Qy1iPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlQYWdlJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICc8Qy1kPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlTY3JvbGwnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIGV4cGxpY2l0UmVwZWF0OiB0cnVlIH19LFxuICAgIHsga2V5czogJzxDLXU+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVNjcm9sbCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIGV4cGxpY2l0UmVwZWF0OiB0cnVlIH19LFxuICAgIHsga2V5czogJ2dnJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb0xpbmVPckVkZ2VPZkRvY3VtZW50JywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgZXhwbGljaXRSZXBlYXQ6IHRydWUsIGxpbmV3aXNlOiB0cnVlLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJ0cnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvTGluZU9yRWRnZU9mRG9jdW1lbnQnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIGV4cGxpY2l0UmVwZWF0OiB0cnVlLCBsaW5ld2lzZTogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICcwJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb1N0YXJ0T2ZMaW5lJyB9LFxuICAgIHsga2V5czogJ14nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyJyB9LFxuICAgIHsga2V5czogJysnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5TGluZXMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIHRvRmlyc3RDaGFyOnRydWUgfX0sXG4gICAgeyBrZXlzOiAnLScsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlMaW5lcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHRvRmlyc3RDaGFyOnRydWUgfX0sXG4gICAgeyBrZXlzOiAnXycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlMaW5lcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgdG9GaXJzdENoYXI6dHJ1ZSwgcmVwZWF0T2Zmc2V0Oi0xIH19LFxuICAgIHsga2V5czogJyQnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvRW9sJywgbW90aW9uQXJnczogeyBpbmNsdXNpdmU6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnJScsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9NYXRjaGVkU3ltYm9sJywgbW90aW9uQXJnczogeyBpbmNsdXNpdmU6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnZjxjaGFyYWN0ZXI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb0NoYXJhY3RlcicsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSAsIGluY2x1c2l2ZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdGPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvQ2hhcmFjdGVyJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICd0PGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRpbGxDaGFyYWN0ZXInLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIGluY2x1c2l2ZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdUPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRpbGxDaGFyYWN0ZXInLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJzsnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAncmVwZWF0TGFzdENoYXJhY3RlclNlYXJjaCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICcsJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ3JlcGVhdExhc3RDaGFyYWN0ZXJTZWFyY2gnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJ1xcJzxjaGFyYWN0ZXI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ2dvVG9NYXJrJywgbW90aW9uQXJnczoge3RvSnVtcGxpc3Q6IHRydWUsIGxpbmV3aXNlOiB0cnVlfX0sXG4gICAgeyBrZXlzOiAnYDxjaGFyYWN0ZXI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ2dvVG9NYXJrJywgbW90aW9uQXJnczoge3RvSnVtcGxpc3Q6IHRydWV9fSxcbiAgICB7IGtleXM6ICddYCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdqdW1wVG9NYXJrJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlIH0gfSxcbiAgICB7IGtleXM6ICdbYCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdqdW1wVG9NYXJrJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSB9IH0sXG4gICAgeyBrZXlzOiAnXVxcJycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdqdW1wVG9NYXJrJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCBsaW5ld2lzZTogdHJ1ZSB9IH0sXG4gICAgeyBrZXlzOiAnW1xcJycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdqdW1wVG9NYXJrJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgbGluZXdpc2U6IHRydWUgfSB9LFxuICAgIC8vIHRoZSBuZXh0IHR3byBhcmVuJ3QgbW90aW9ucyBidXQgbXVzdCBjb21lIGJlZm9yZSBtb3JlIGdlbmVyYWwgbW90aW9uIGRlY2xhcmF0aW9uc1xuICAgIHsga2V5czogJ11wJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Bhc3RlJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGFmdGVyOiB0cnVlLCBpc0VkaXQ6IHRydWUsIG1hdGNoSW5kZW50OiB0cnVlfX0sXG4gICAgeyBrZXlzOiAnW3AnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAncGFzdGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgYWZ0ZXI6IGZhbHNlLCBpc0VkaXQ6IHRydWUsIG1hdGNoSW5kZW50OiB0cnVlfX0sXG4gICAgeyBrZXlzOiAnXTxjaGFyYWN0ZXI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb1N5bWJvbCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZX19LFxuICAgIHsga2V5czogJ1s8Y2hhcmFjdGVyPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9TeW1ib2wnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCB0b0p1bXBsaXN0OiB0cnVlfX0sXG4gICAgeyBrZXlzOiAnfCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9Db2x1bW4nfSxcbiAgICB7IGtleXM6ICdvJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb090aGVySGlnaGxpZ2h0ZWRFbmQnLCBjb250ZXh0Oid2aXN1YWwnfSxcbiAgICB7IGtleXM6ICdPJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb090aGVySGlnaGxpZ2h0ZWRFbmQnLCBtb3Rpb25BcmdzOiB7c2FtZUxpbmU6IHRydWV9LCBjb250ZXh0Oid2aXN1YWwnfSxcbiAgICAvLyBPcGVyYXRvcnNcbiAgICB7IGtleXM6ICdkJywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdkZWxldGUnIH0sXG4gICAgeyBrZXlzOiAneScsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAneWFuaycgfSxcbiAgICB7IGtleXM6ICdjJywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdjaGFuZ2UnIH0sXG4gICAgeyBrZXlzOiAnPScsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnaW5kZW50QXV0bycgfSxcbiAgICB7IGtleXM6ICc+JywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdpbmRlbnQnLCBvcGVyYXRvckFyZ3M6IHsgaW5kZW50UmlnaHQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnPCcsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnaW5kZW50Jywgb3BlcmF0b3JBcmdzOiB7IGluZGVudFJpZ2h0OiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICdnficsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnY2hhbmdlQ2FzZScgfSxcbiAgICB7IGtleXM6ICdndScsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnY2hhbmdlQ2FzZScsIG9wZXJhdG9yQXJnczoge3RvTG93ZXI6IHRydWV9LCBpc0VkaXQ6IHRydWUgfSxcbiAgICB7IGtleXM6ICdnVScsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnY2hhbmdlQ2FzZScsIG9wZXJhdG9yQXJnczoge3RvTG93ZXI6IGZhbHNlfSwgaXNFZGl0OiB0cnVlIH0sXG4gICAgeyBrZXlzOiAnbicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdmaW5kTmV4dCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdOJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ2ZpbmROZXh0JywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICAvLyBPcGVyYXRvci1Nb3Rpb24gZHVhbCBjb21tYW5kc1xuICAgIHsga2V5czogJ3gnLCB0eXBlOiAnb3BlcmF0b3JNb3Rpb24nLCBvcGVyYXRvcjogJ2RlbGV0ZScsIG1vdGlvbjogJ21vdmVCeUNoYXJhY3RlcnMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUgfSwgb3BlcmF0b3JNb3Rpb25BcmdzOiB7IHZpc3VhbExpbmU6IGZhbHNlIH19LFxuICAgIHsga2V5czogJ1gnLCB0eXBlOiAnb3BlcmF0b3JNb3Rpb24nLCBvcGVyYXRvcjogJ2RlbGV0ZScsIG1vdGlvbjogJ21vdmVCeUNoYXJhY3RlcnMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlIH0sIG9wZXJhdG9yTW90aW9uQXJnczogeyB2aXN1YWxMaW5lOiB0cnVlIH19LFxuICAgIHsga2V5czogJ0QnLCB0eXBlOiAnb3BlcmF0b3JNb3Rpb24nLCBvcGVyYXRvcjogJ2RlbGV0ZScsIG1vdGlvbjogJ21vdmVUb0VvbCcsIG1vdGlvbkFyZ3M6IHsgaW5jbHVzaXZlOiB0cnVlIH0sIGNvbnRleHQ6ICdub3JtYWwnfSxcbiAgICB7IGtleXM6ICdEJywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdkZWxldGUnLCBvcGVyYXRvckFyZ3M6IHsgbGluZXdpc2U6IHRydWUgfSwgY29udGV4dDogJ3Zpc3VhbCd9LFxuICAgIHsga2V5czogJ1knLCB0eXBlOiAnb3BlcmF0b3JNb3Rpb24nLCBvcGVyYXRvcjogJ3lhbmsnLCBtb3Rpb246ICdleHBhbmRUb0xpbmUnLCBtb3Rpb25BcmdzOiB7IGxpbmV3aXNlOiB0cnVlIH0sIGNvbnRleHQ6ICdub3JtYWwnfSxcbiAgICB7IGtleXM6ICdZJywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICd5YW5rJywgb3BlcmF0b3JBcmdzOiB7IGxpbmV3aXNlOiB0cnVlIH0sIGNvbnRleHQ6ICd2aXN1YWwnfSxcbiAgICB7IGtleXM6ICdDJywgdHlwZTogJ29wZXJhdG9yTW90aW9uJywgb3BlcmF0b3I6ICdjaGFuZ2UnLCBtb3Rpb246ICdtb3ZlVG9Fb2wnLCBtb3Rpb25BcmdzOiB7IGluY2x1c2l2ZTogdHJ1ZSB9LCBjb250ZXh0OiAnbm9ybWFsJ30sXG4gICAgeyBrZXlzOiAnQycsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnY2hhbmdlJywgb3BlcmF0b3JBcmdzOiB7IGxpbmV3aXNlOiB0cnVlIH0sIGNvbnRleHQ6ICd2aXN1YWwnfSxcbiAgICB7IGtleXM6ICd+JywgdHlwZTogJ29wZXJhdG9yTW90aW9uJywgb3BlcmF0b3I6ICdjaGFuZ2VDYXNlJywgbW90aW9uOiAnbW92ZUJ5Q2hhcmFjdGVycycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSB9LCBvcGVyYXRvckFyZ3M6IHsgc2hvdWxkTW92ZUN1cnNvcjogdHJ1ZSB9LCBjb250ZXh0OiAnbm9ybWFsJ30sXG4gICAgeyBrZXlzOiAnficsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnY2hhbmdlQ2FzZScsIGNvbnRleHQ6ICd2aXN1YWwnfSxcbiAgICB7IGtleXM6ICc8Qy13PicsIHR5cGU6ICdvcGVyYXRvck1vdGlvbicsIG9wZXJhdG9yOiAnZGVsZXRlJywgbW90aW9uOiAnbW92ZUJ5V29yZHMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCB3b3JkRW5kOiBmYWxzZSB9LCBjb250ZXh0OiAnaW5zZXJ0JyB9LFxuICAgIC8vaWdub3JlIEMtdyBpbiBub3JtYWwgbW9kZVxuICAgIHsga2V5czogJzxDLXc+JywgdHlwZTogJ2lkbGUnLCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIC8vIEFjdGlvbnNcbiAgICB7IGtleXM6ICc8Qy1pPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdqdW1wTGlzdFdhbGsnLCBhY3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnPEMtbz4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnanVtcExpc3RXYWxrJywgYWN0aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICc8Qy1lPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzY3JvbGwnLCBhY3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIGxpbmV3aXNlOiB0cnVlIH19LFxuICAgIHsga2V5czogJzxDLXk+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Njcm9sbCcsIGFjdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIGxpbmV3aXNlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ2EnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnZW50ZXJJbnNlcnRNb2RlJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGluc2VydEF0OiAnY2hhckFmdGVyJyB9LCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJ0EnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnZW50ZXJJbnNlcnRNb2RlJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGluc2VydEF0OiAnZW9sJyB9LCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJ0EnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnZW50ZXJJbnNlcnRNb2RlJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGluc2VydEF0OiAnZW5kT2ZTZWxlY3RlZEFyZWEnIH0sIGNvbnRleHQ6ICd2aXN1YWwnIH0sXG4gICAgeyBrZXlzOiAnaScsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdlbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgaW5zZXJ0QXQ6ICdpbnBsYWNlJyB9LCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJ0knLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnZW50ZXJJbnNlcnRNb2RlJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGluc2VydEF0OiAnZmlyc3ROb25CbGFuayd9LCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJ0knLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnZW50ZXJJbnNlcnRNb2RlJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGluc2VydEF0OiAnc3RhcnRPZlNlbGVjdGVkQXJlYScgfSwgY29udGV4dDogJ3Zpc3VhbCcgfSxcbiAgICB7IGtleXM6ICdvJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ25ld0xpbmVBbmRFbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGludGVybGFjZUluc2VydFJlcGVhdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBhZnRlcjogdHJ1ZSB9LCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJ08nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnbmV3TGluZUFuZEVudGVySW5zZXJ0TW9kZScsIGlzRWRpdDogdHJ1ZSwgaW50ZXJsYWNlSW5zZXJ0UmVwZWF0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGFmdGVyOiBmYWxzZSB9LCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJ3YnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAndG9nZ2xlVmlzdWFsTW9kZScgfSxcbiAgICB7IGtleXM6ICdWJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3RvZ2dsZVZpc3VhbE1vZGUnLCBhY3Rpb25BcmdzOiB7IGxpbmV3aXNlOiB0cnVlIH19LFxuICAgIHsga2V5czogJzxDLXY+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3RvZ2dsZVZpc3VhbE1vZGUnLCBhY3Rpb25BcmdzOiB7IGJsb2Nrd2lzZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICc8Qy1xPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICd0b2dnbGVWaXN1YWxNb2RlJywgYWN0aW9uQXJnczogeyBibG9ja3dpc2U6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnZ3YnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAncmVzZWxlY3RMYXN0U2VsZWN0aW9uJyB9LFxuICAgIHsga2V5czogJ0onLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnam9pbkxpbmVzJywgaXNFZGl0OiB0cnVlIH0sXG4gICAgeyBrZXlzOiAncCcsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdwYXN0ZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBhZnRlcjogdHJ1ZSwgaXNFZGl0OiB0cnVlIH19LFxuICAgIHsga2V5czogJ1AnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAncGFzdGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgYWZ0ZXI6IGZhbHNlLCBpc0VkaXQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAncjxjaGFyYWN0ZXI+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3JlcGxhY2UnLCBpc0VkaXQ6IHRydWUgfSxcbiAgICB7IGtleXM6ICdAPGNoYXJhY3Rlcj4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAncmVwbGF5TWFjcm8nIH0sXG4gICAgeyBrZXlzOiAncTxjaGFyYWN0ZXI+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2VudGVyTWFjcm9SZWNvcmRNb2RlJyB9LFxuICAgIC8vIEhhbmRsZSBSZXBsYWNlLW1vZGUgYXMgYSBzcGVjaWFsIGNhc2Ugb2YgaW5zZXJ0IG1vZGUuXG4gICAgeyBrZXlzOiAnUicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdlbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgcmVwbGFjZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICd1JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3VuZG8nLCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJ3UnLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2NoYW5nZUNhc2UnLCBvcGVyYXRvckFyZ3M6IHt0b0xvd2VyOiB0cnVlfSwgY29udGV4dDogJ3Zpc3VhbCcsIGlzRWRpdDogdHJ1ZSB9LFxuICAgIHsga2V5czogJ1UnLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2NoYW5nZUNhc2UnLCBvcGVyYXRvckFyZ3M6IHt0b0xvd2VyOiBmYWxzZX0sIGNvbnRleHQ6ICd2aXN1YWwnLCBpc0VkaXQ6IHRydWUgfSxcbiAgICB7IGtleXM6ICc8Qy1yPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdyZWRvJyB9LFxuICAgIHsga2V5czogJ208Y2hhcmFjdGVyPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzZXRNYXJrJyB9LFxuICAgIHsga2V5czogJ1wiPGNoYXJhY3Rlcj4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnc2V0UmVnaXN0ZXInIH0sXG4gICAgeyBrZXlzOiAnenonLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnc2Nyb2xsVG9DdXJzb3InLCBhY3Rpb25BcmdzOiB7IHBvc2l0aW9uOiAnY2VudGVyJyB9fSxcbiAgICB7IGtleXM6ICd6LicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzY3JvbGxUb0N1cnNvcicsIGFjdGlvbkFyZ3M6IHsgcG9zaXRpb246ICdjZW50ZXInIH0sIG1vdGlvbjogJ21vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcicgfSxcbiAgICB7IGtleXM6ICd6dCcsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzY3JvbGxUb0N1cnNvcicsIGFjdGlvbkFyZ3M6IHsgcG9zaXRpb246ICd0b3AnIH19LFxuICAgIHsga2V5czogJ3o8Q1I+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Njcm9sbFRvQ3Vyc29yJywgYWN0aW9uQXJnczogeyBwb3NpdGlvbjogJ3RvcCcgfSwgbW90aW9uOiAnbW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyJyB9LFxuICAgIHsga2V5czogJ3otJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Njcm9sbFRvQ3Vyc29yJywgYWN0aW9uQXJnczogeyBwb3NpdGlvbjogJ2JvdHRvbScgfX0sXG4gICAgeyBrZXlzOiAnemInLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnc2Nyb2xsVG9DdXJzb3InLCBhY3Rpb25BcmdzOiB7IHBvc2l0aW9uOiAnYm90dG9tJyB9LCBtb3Rpb246ICdtb3ZlVG9GaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXInIH0sXG4gICAgeyBrZXlzOiAnLicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdyZXBlYXRMYXN0RWRpdCcgfSxcbiAgICB7IGtleXM6ICc8Qy1hPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdpbmNyZW1lbnROdW1iZXJUb2tlbicsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczoge2luY3JlYXNlOiB0cnVlLCBiYWNrdHJhY2s6IGZhbHNlfX0sXG4gICAgeyBrZXlzOiAnPEMteD4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnaW5jcmVtZW50TnVtYmVyVG9rZW4nLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHtpbmNyZWFzZTogZmFsc2UsIGJhY2t0cmFjazogZmFsc2V9fSxcbiAgICB7IGtleXM6ICc8Qy10PicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdpbmRlbnQnLCBhY3Rpb25BcmdzOiB7IGluZGVudFJpZ2h0OiB0cnVlIH0sIGNvbnRleHQ6ICdpbnNlcnQnIH0sXG4gICAgeyBrZXlzOiAnPEMtZD4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnaW5kZW50JywgYWN0aW9uQXJnczogeyBpbmRlbnRSaWdodDogZmFsc2UgfSwgY29udGV4dDogJ2luc2VydCcgfSxcbiAgICAvLyBUZXh0IG9iamVjdCBtb3Rpb25zXG4gICAgeyBrZXlzOiAnYTxjaGFyYWN0ZXI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ3RleHRPYmplY3RNYW5pcHVsYXRpb24nIH0sXG4gICAgeyBrZXlzOiAnaTxjaGFyYWN0ZXI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ3RleHRPYmplY3RNYW5pcHVsYXRpb24nLCBtb3Rpb25BcmdzOiB7IHRleHRPYmplY3RJbm5lcjogdHJ1ZSB9fSxcbiAgICAvLyBTZWFyY2hcbiAgICB7IGtleXM6ICcvJywgdHlwZTogJ3NlYXJjaCcsIHNlYXJjaEFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgcXVlcnlTcmM6ICdwcm9tcHQnLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJz8nLCB0eXBlOiAnc2VhcmNoJywgc2VhcmNoQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgcXVlcnlTcmM6ICdwcm9tcHQnLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJyonLCB0eXBlOiAnc2VhcmNoJywgc2VhcmNoQXJnczogeyBmb3J3YXJkOiB0cnVlLCBxdWVyeVNyYzogJ3dvcmRVbmRlckN1cnNvcicsIHdob2xlV29yZE9ubHk6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnIycsIHR5cGU6ICdzZWFyY2gnLCBzZWFyY2hBcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBxdWVyeVNyYzogJ3dvcmRVbmRlckN1cnNvcicsIHdob2xlV29yZE9ubHk6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnZyonLCB0eXBlOiAnc2VhcmNoJywgc2VhcmNoQXJnczogeyBmb3J3YXJkOiB0cnVlLCBxdWVyeVNyYzogJ3dvcmRVbmRlckN1cnNvcicsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnZyMnLCB0eXBlOiAnc2VhcmNoJywgc2VhcmNoQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgcXVlcnlTcmM6ICd3b3JkVW5kZXJDdXJzb3InLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIC8vIEV4IGNvbW1hbmRcbiAgICB7IGtleXM6ICc6JywgdHlwZTogJ2V4JyB9XG4gIF07XG4gIHZhciBkZWZhdWx0S2V5bWFwTGVuZ3RoID0gZGVmYXVsdEtleW1hcC5sZW5ndGg7XG5cbiAgLyoqXG4gICAqIEV4IGNvbW1hbmRzXG4gICAqIENhcmUgbXVzdCBiZSB0YWtlbiB3aGVuIGFkZGluZyB0byB0aGUgZGVmYXVsdCBFeCBjb21tYW5kIG1hcC4gRm9yIGFueVxuICAgKiBwYWlyIG9mIGNvbW1hbmRzIHRoYXQgaGF2ZSBhIHNoYXJlZCBwcmVmaXgsIGF0IGxlYXN0IG9uZSBvZiB0aGVpclxuICAgKiBzaG9ydE5hbWVzIG11c3Qgbm90IG1hdGNoIHRoZSBwcmVmaXggb2YgdGhlIG90aGVyIGNvbW1hbmQuXG4gICAqL1xuICB2YXIgZGVmYXVsdEV4Q29tbWFuZE1hcCA9IFtcbiAgICB7IG5hbWU6ICdjb2xvcnNjaGVtZScsIHNob3J0TmFtZTogJ2NvbG8nIH0sXG4gICAgeyBuYW1lOiAnbWFwJyB9LFxuICAgIHsgbmFtZTogJ2ltYXAnLCBzaG9ydE5hbWU6ICdpbScgfSxcbiAgICB7IG5hbWU6ICdubWFwJywgc2hvcnROYW1lOiAnbm0nIH0sXG4gICAgeyBuYW1lOiAndm1hcCcsIHNob3J0TmFtZTogJ3ZtJyB9LFxuICAgIHsgbmFtZTogJ3VubWFwJyB9LFxuICAgIHsgbmFtZTogJ3dyaXRlJywgc2hvcnROYW1lOiAndycgfSxcbiAgICB7IG5hbWU6ICd1bmRvJywgc2hvcnROYW1lOiAndScgfSxcbiAgICB7IG5hbWU6ICdyZWRvJywgc2hvcnROYW1lOiAncmVkJyB9LFxuICAgIHsgbmFtZTogJ3NldCcsIHNob3J0TmFtZTogJ3NlJyB9LFxuICAgIHsgbmFtZTogJ3NldCcsIHNob3J0TmFtZTogJ3NlJyB9LFxuICAgIHsgbmFtZTogJ3NldGxvY2FsJywgc2hvcnROYW1lOiAnc2V0bCcgfSxcbiAgICB7IG5hbWU6ICdzZXRnbG9iYWwnLCBzaG9ydE5hbWU6ICdzZXRnJyB9LFxuICAgIHsgbmFtZTogJ3NvcnQnLCBzaG9ydE5hbWU6ICdzb3InIH0sXG4gICAgeyBuYW1lOiAnc3Vic3RpdHV0ZScsIHNob3J0TmFtZTogJ3MnLCBwb3NzaWJseUFzeW5jOiB0cnVlIH0sXG4gICAgeyBuYW1lOiAnbm9obHNlYXJjaCcsIHNob3J0TmFtZTogJ25vaCcgfSxcbiAgICB7IG5hbWU6ICd5YW5rJywgc2hvcnROYW1lOiAneScgfSxcbiAgICB7IG5hbWU6ICdkZWxtYXJrcycsIHNob3J0TmFtZTogJ2RlbG0nIH0sXG4gICAgeyBuYW1lOiAncmVnaXN0ZXJzJywgc2hvcnROYW1lOiAncmVnJywgZXhjbHVkZUZyb21Db21tYW5kSGlzdG9yeTogdHJ1ZSB9LFxuICAgIHsgbmFtZTogJ2dsb2JhbCcsIHNob3J0TmFtZTogJ2cnIH1cbiAgXTtcblxuICB2YXIgUG9zID0gQ29kZU1pcnJvci5Qb3M7XG5cbiAgdmFyIFZpbSA9IGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIGVudGVyVmltTW9kZShjbSkge1xuICAgICAgY20uc2V0T3B0aW9uKCdkaXNhYmxlSW5wdXQnLCB0cnVlKTtcbiAgICAgIGNtLnNldE9wdGlvbignc2hvd0N1cnNvcldoZW5TZWxlY3RpbmcnLCBmYWxzZSk7XG4gICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwibm9ybWFsXCJ9KTtcbiAgICAgIGNtLm9uKCdjdXJzb3JBY3Rpdml0eScsIG9uQ3Vyc29yQWN0aXZpdHkpO1xuICAgICAgbWF5YmVJbml0VmltU3RhdGUoY20pO1xuICAgICAgQ29kZU1pcnJvci5vbihjbS5nZXRJbnB1dEZpZWxkKCksICdwYXN0ZScsIGdldE9uUGFzdGVGbihjbSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxlYXZlVmltTW9kZShjbSkge1xuICAgICAgY20uc2V0T3B0aW9uKCdkaXNhYmxlSW5wdXQnLCBmYWxzZSk7XG4gICAgICBjbS5vZmYoJ2N1cnNvckFjdGl2aXR5Jywgb25DdXJzb3JBY3Rpdml0eSk7XG4gICAgICBDb2RlTWlycm9yLm9mZihjbS5nZXRJbnB1dEZpZWxkKCksICdwYXN0ZScsIGdldE9uUGFzdGVGbihjbSkpO1xuICAgICAgY20uc3RhdGUudmltID0gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXRhY2hWaW1NYXAoY20sIG5leHQpIHtcbiAgICAgIGlmICh0aGlzID09IENvZGVNaXJyb3Iua2V5TWFwLnZpbSkge1xuICAgICAgICBDb2RlTWlycm9yLnJtQ2xhc3MoY20uZ2V0V3JhcHBlckVsZW1lbnQoKSwgXCJjbS1mYXQtY3Vyc29yXCIpO1xuICAgICAgICBpZiAoY20uZ2V0T3B0aW9uKFwiaW5wdXRTdHlsZVwiKSA9PSBcImNvbnRlbnRlZGl0YWJsZVwiICYmIGRvY3VtZW50LmJvZHkuc3R5bGUuY2FyZXRDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgZGlzYWJsZUZhdEN1cnNvck1hcmsoY20pO1xuICAgICAgICAgIGNtLmdldElucHV0RmllbGQoKS5zdHlsZS5jYXJldENvbG9yID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIW5leHQgfHwgbmV4dC5hdHRhY2ggIT0gYXR0YWNoVmltTWFwKVxuICAgICAgICBsZWF2ZVZpbU1vZGUoY20pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhdHRhY2hWaW1NYXAoY20sIHByZXYpIHtcbiAgICAgIGlmICh0aGlzID09IENvZGVNaXJyb3Iua2V5TWFwLnZpbSkge1xuICAgICAgICBDb2RlTWlycm9yLmFkZENsYXNzKGNtLmdldFdyYXBwZXJFbGVtZW50KCksIFwiY20tZmF0LWN1cnNvclwiKTtcbiAgICAgICAgaWYgKGNtLmdldE9wdGlvbihcImlucHV0U3R5bGVcIikgPT0gXCJjb250ZW50ZWRpdGFibGVcIiAmJiBkb2N1bWVudC5ib2R5LnN0eWxlLmNhcmV0Q29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgIGVuYWJsZUZhdEN1cnNvck1hcmsoY20pO1xuICAgICAgICAgIGNtLmdldElucHV0RmllbGQoKS5zdHlsZS5jYXJldENvbG9yID0gXCJ0cmFuc3BhcmVudFwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghcHJldiB8fCBwcmV2LmF0dGFjaCAhPSBhdHRhY2hWaW1NYXApXG4gICAgICAgIGVudGVyVmltTW9kZShjbSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlRmF0Q3Vyc29yTWFyayhjbSkge1xuICAgICAgaWYgKCFjbS5zdGF0ZS5mYXRDdXJzb3JNYXJrcykgcmV0dXJuO1xuICAgICAgY2xlYXJGYXRDdXJzb3JNYXJrKGNtKTtcbiAgICAgIHZhciByYW5nZXMgPSBjbS5saXN0U2VsZWN0aW9ucygpLCByZXN1bHQgPSBbXVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJhbmdlID0gcmFuZ2VzW2ldXG4gICAgICAgIGlmIChyYW5nZS5lbXB0eSgpKSB7XG4gICAgICAgICAgaWYgKHJhbmdlLmFuY2hvci5jaCA8IGNtLmdldExpbmUocmFuZ2UuYW5jaG9yLmxpbmUpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goY20ubWFya1RleHQocmFuZ2UuYW5jaG9yLCBQb3MocmFuZ2UuYW5jaG9yLmxpbmUsIHJhbmdlLmFuY2hvci5jaCArIDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2NsYXNzTmFtZTogXCJjbS1mYXQtY3Vyc29yLW1hcmtcIn0pKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgd2lkZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIilcbiAgICAgICAgICAgIHdpZGdldC50ZXh0Q29udGVudCA9IFwiXFx1MDBhMFwiXG4gICAgICAgICAgICB3aWRnZXQuY2xhc3NOYW1lID0gXCJjbS1mYXQtY3Vyc29yLW1hcmtcIlxuICAgICAgICAgICAgcmVzdWx0LnB1c2goY20uc2V0Qm9va21hcmsocmFuZ2UuYW5jaG9yLCB7d2lkZ2V0OiB3aWRnZXR9KSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNtLnN0YXRlLmZhdEN1cnNvck1hcmtzID0gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyRmF0Q3Vyc29yTWFyayhjbSkge1xuICAgICAgdmFyIG1hcmtzID0gY20uc3RhdGUuZmF0Q3Vyc29yTWFya3M7XG4gICAgICBpZiAobWFya3MpIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya3MubGVuZ3RoOyBpKyspIG1hcmtzW2ldLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5hYmxlRmF0Q3Vyc29yTWFyayhjbSkge1xuICAgICAgY20uc3RhdGUuZmF0Q3Vyc29yTWFya3MgPSBbXTtcbiAgICAgIHVwZGF0ZUZhdEN1cnNvck1hcmsoY20pXG4gICAgICBjbS5vbihcImN1cnNvckFjdGl2aXR5XCIsIHVwZGF0ZUZhdEN1cnNvck1hcmspXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzYWJsZUZhdEN1cnNvck1hcmsoY20pIHtcbiAgICAgIGNsZWFyRmF0Q3Vyc29yTWFyayhjbSk7XG4gICAgICBjbS5vZmYoXCJjdXJzb3JBY3Rpdml0eVwiLCB1cGRhdGVGYXRDdXJzb3JNYXJrKTtcbiAgICAgIC8vIGV4cGxpY2l0bHkgc2V0IGZhdEN1cnNvck1hcmtzIHRvIG51bGwgYmVjYXVzZSBldmVudCBsaXN0ZW5lciBhYm92ZVxuICAgICAgLy8gY2FuIGJlIGludm9rZSBhZnRlciByZW1vdmluZyBpdCwgaWYgb2ZmIGlzIGNhbGxlZCBmcm9tIG9wZXJhdGlvblxuICAgICAgY20uc3RhdGUuZmF0Q3Vyc29yTWFya3MgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIERlcHJlY2F0ZWQsIHNpbXBseSBzZXR0aW5nIHRoZSBrZXltYXAgd29ya3MgYWdhaW4uXG4gICAgQ29kZU1pcnJvci5kZWZpbmVPcHRpb24oJ3ZpbU1vZGUnLCBmYWxzZSwgZnVuY3Rpb24oY20sIHZhbCwgcHJldikge1xuICAgICAgaWYgKHZhbCAmJiBjbS5nZXRPcHRpb24oXCJrZXlNYXBcIikgIT0gXCJ2aW1cIilcbiAgICAgICAgY20uc2V0T3B0aW9uKFwia2V5TWFwXCIsIFwidmltXCIpO1xuICAgICAgZWxzZSBpZiAoIXZhbCAmJiBwcmV2ICE9IENvZGVNaXJyb3IuSW5pdCAmJiAvXnZpbS8udGVzdChjbS5nZXRPcHRpb24oXCJrZXlNYXBcIikpKVxuICAgICAgICBjbS5zZXRPcHRpb24oXCJrZXlNYXBcIiwgXCJkZWZhdWx0XCIpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gY21LZXkoa2V5LCBjbSkge1xuICAgICAgaWYgKCFjbSkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgICBpZiAodGhpc1trZXldKSB7IHJldHVybiB0aGlzW2tleV07IH1cbiAgICAgIHZhciB2aW1LZXkgPSBjbUtleVRvVmltS2V5KGtleSk7XG4gICAgICBpZiAoIXZpbUtleSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgY21kID0gQ29kZU1pcnJvci5WaW0uZmluZEtleShjbSwgdmltS2V5KTtcbiAgICAgIGlmICh0eXBlb2YgY21kID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgQ29kZU1pcnJvci5zaWduYWwoY20sICd2aW0ta2V5cHJlc3MnLCB2aW1LZXkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICB2YXIgbW9kaWZpZXJzID0geydTaGlmdCc6ICdTJywgJ0N0cmwnOiAnQycsICdBbHQnOiAnQScsICdDbWQnOiAnRCcsICdNb2QnOiAnQSd9O1xuICAgIHZhciBzcGVjaWFsS2V5cyA9IHtFbnRlcjonQ1InLEJhY2tzcGFjZTonQlMnLERlbGV0ZTonRGVsJyxJbnNlcnQ6J0lucyd9O1xuICAgIGZ1bmN0aW9uIGNtS2V5VG9WaW1LZXkoa2V5KSB7XG4gICAgICBpZiAoa2V5LmNoYXJBdCgwKSA9PSAnXFwnJykge1xuICAgICAgICAvLyBLZXlwcmVzcyBjaGFyYWN0ZXIgYmluZGluZyBvZiBmb3JtYXQgXCInYSdcIlxuICAgICAgICByZXR1cm4ga2V5LmNoYXJBdCgxKTtcbiAgICAgIH1cbiAgICAgIHZhciBwaWVjZXMgPSBrZXkuc3BsaXQoLy0oPyEkKS8pO1xuICAgICAgdmFyIGxhc3RQaWVjZSA9IHBpZWNlc1twaWVjZXMubGVuZ3RoIC0gMV07XG4gICAgICBpZiAocGllY2VzLmxlbmd0aCA9PSAxICYmIHBpZWNlc1swXS5sZW5ndGggPT0gMSkge1xuICAgICAgICAvLyBOby1tb2RpZmllciBiaW5kaW5ncyB1c2UgbGl0ZXJhbCBjaGFyYWN0ZXIgYmluZGluZ3MgYWJvdmUuIFNraXAuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAocGllY2VzLmxlbmd0aCA9PSAyICYmIHBpZWNlc1swXSA9PSAnU2hpZnQnICYmIGxhc3RQaWVjZS5sZW5ndGggPT0gMSkge1xuICAgICAgICAvLyBJZ25vcmUgU2hpZnQrY2hhciBiaW5kaW5ncyBhcyB0aGV5IHNob3VsZCBiZSBoYW5kbGVkIGJ5IGxpdGVyYWwgY2hhcmFjdGVyLlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgaGFzQ2hhcmFjdGVyID0gZmFsc2U7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBpZWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGllY2UgPSBwaWVjZXNbaV07XG4gICAgICAgIGlmIChwaWVjZSBpbiBtb2RpZmllcnMpIHsgcGllY2VzW2ldID0gbW9kaWZpZXJzW3BpZWNlXTsgfVxuICAgICAgICBlbHNlIHsgaGFzQ2hhcmFjdGVyID0gdHJ1ZTsgfVxuICAgICAgICBpZiAocGllY2UgaW4gc3BlY2lhbEtleXMpIHsgcGllY2VzW2ldID0gc3BlY2lhbEtleXNbcGllY2VdOyB9XG4gICAgICB9XG4gICAgICBpZiAoIWhhc0NoYXJhY3Rlcikge1xuICAgICAgICAvLyBWaW0gZG9lcyBub3Qgc3VwcG9ydCBtb2RpZmllciBvbmx5IGtleXMuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIFRPRE86IEN1cnJlbnQgYmluZGluZ3MgZXhwZWN0IHRoZSBjaGFyYWN0ZXIgdG8gYmUgbG93ZXIgY2FzZSwgYnV0XG4gICAgICAvLyBpdCBsb29rcyBsaWtlIHZpbSBrZXkgbm90YXRpb24gdXNlcyB1cHBlciBjYXNlLlxuICAgICAgaWYgKGlzVXBwZXJDYXNlKGxhc3RQaWVjZSkpIHtcbiAgICAgICAgcGllY2VzW3BpZWNlcy5sZW5ndGggLSAxXSA9IGxhc3RQaWVjZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICc8JyArIHBpZWNlcy5qb2luKCctJykgKyAnPic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T25QYXN0ZUZuKGNtKSB7XG4gICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgaWYgKCF2aW0ub25QYXN0ZUZuKSB7XG4gICAgICAgIHZpbS5vblBhc3RlRm4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoIXZpbS5pbnNlcnRNb2RlKSB7XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3Iob2Zmc2V0Q3Vyc29yKGNtLmdldEN1cnNvcigpLCAwLCAxKSk7XG4gICAgICAgICAgICBhY3Rpb25zLmVudGVySW5zZXJ0TW9kZShjbSwge30sIHZpbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZpbS5vblBhc3RlRm47XG4gICAgfVxuXG4gICAgdmFyIG51bWJlclJlZ2V4ID0gL1tcXGRdLztcbiAgICB2YXIgd29yZENoYXJUZXN0ID0gW0NvZGVNaXJyb3IuaXNXb3JkQ2hhciwgZnVuY3Rpb24oY2gpIHtcbiAgICAgIHJldHVybiBjaCAmJiAhQ29kZU1pcnJvci5pc1dvcmRDaGFyKGNoKSAmJiAhL1xccy8udGVzdChjaCk7XG4gICAgfV0sIGJpZ1dvcmRDaGFyVGVzdCA9IFtmdW5jdGlvbihjaCkge1xuICAgICAgcmV0dXJuIC9cXFMvLnRlc3QoY2gpO1xuICAgIH1dO1xuICAgIGZ1bmN0aW9uIG1ha2VLZXlSYW5nZShzdGFydCwgc2l6ZSkge1xuICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IHN0YXJ0ICsgc2l6ZTsgaSsrKSB7XG4gICAgICAgIGtleXMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGkpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cbiAgICB2YXIgdXBwZXJDYXNlQWxwaGFiZXQgPSBtYWtlS2V5UmFuZ2UoNjUsIDI2KTtcbiAgICB2YXIgbG93ZXJDYXNlQWxwaGFiZXQgPSBtYWtlS2V5UmFuZ2UoOTcsIDI2KTtcbiAgICB2YXIgbnVtYmVycyA9IG1ha2VLZXlSYW5nZSg0OCwgMTApO1xuICAgIHZhciB2YWxpZE1hcmtzID0gW10uY29uY2F0KHVwcGVyQ2FzZUFscGhhYmV0LCBsb3dlckNhc2VBbHBoYWJldCwgbnVtYmVycywgWyc8JywgJz4nXSk7XG4gICAgdmFyIHZhbGlkUmVnaXN0ZXJzID0gW10uY29uY2F0KHVwcGVyQ2FzZUFscGhhYmV0LCBsb3dlckNhc2VBbHBoYWJldCwgbnVtYmVycywgWyctJywgJ1wiJywgJy4nLCAnOicsICcvJ10pO1xuXG4gICAgZnVuY3Rpb24gaXNMaW5lKGNtLCBsaW5lKSB7XG4gICAgICByZXR1cm4gbGluZSA+PSBjbS5maXJzdExpbmUoKSAmJiBsaW5lIDw9IGNtLmxhc3RMaW5lKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzTG93ZXJDYXNlKGspIHtcbiAgICAgIHJldHVybiAoL15bYS16XSQvKS50ZXN0KGspO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc01hdGNoYWJsZVN5bWJvbChrKSB7XG4gICAgICByZXR1cm4gJygpW117fScuaW5kZXhPZihrKSAhPSAtMTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOdW1iZXIoaykge1xuICAgICAgcmV0dXJuIG51bWJlclJlZ2V4LnRlc3Qoayk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzVXBwZXJDYXNlKGspIHtcbiAgICAgIHJldHVybiAoL15bQS1aXSQvKS50ZXN0KGspO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1doaXRlU3BhY2VTdHJpbmcoaykge1xuICAgICAgcmV0dXJuICgvXlxccyokLykudGVzdChrKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNFbmRPZlNlbnRlbmNlU3ltYm9sKGspIHtcbiAgICAgIHJldHVybiAnLj8hJy5pbmRleE9mKGspICE9IC0xO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbkFycmF5KHZhbCwgYXJyKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXJyW2ldID09IHZhbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICBmdW5jdGlvbiBkZWZpbmVPcHRpb24obmFtZSwgZGVmYXVsdFZhbHVlLCB0eXBlLCBhbGlhc2VzLCBjYWxsYmFjaykge1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkICYmICFjYWxsYmFjaykge1xuICAgICAgICB0aHJvdyBFcnJvcignZGVmYXVsdFZhbHVlIGlzIHJlcXVpcmVkIHVubGVzcyBjYWxsYmFjayBpcyBwcm92aWRlZCcpO1xuICAgICAgfVxuICAgICAgaWYgKCF0eXBlKSB7IHR5cGUgPSAnc3RyaW5nJzsgfVxuICAgICAgb3B0aW9uc1tuYW1lXSA9IHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0VmFsdWUsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgfTtcbiAgICAgIGlmIChhbGlhc2VzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxpYXNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIG9wdGlvbnNbYWxpYXNlc1tpXV0gPSBvcHRpb25zW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIHNldE9wdGlvbihuYW1lLCBkZWZhdWx0VmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9wdGlvbihuYW1lLCB2YWx1ZSwgY20sIGNmZykge1xuICAgICAgdmFyIG9wdGlvbiA9IG9wdGlvbnNbbmFtZV07XG4gICAgICBjZmcgPSBjZmcgfHwge307XG4gICAgICB2YXIgc2NvcGUgPSBjZmcuc2NvcGU7XG4gICAgICBpZiAoIW9wdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdVbmtub3duIG9wdGlvbjogJyArIG5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbi50eXBlID09ICdib29sZWFuJykge1xuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUgIT09IHRydWUpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50OiAnICsgbmFtZSArICc9JyArIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyBCb29sZWFuIG9wdGlvbnMgYXJlIHNldCB0byB0cnVlIGlmIHZhbHVlIGlzIG5vdCBkZWZpbmVkLlxuICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbi5jYWxsYmFjaykge1xuICAgICAgICBpZiAoc2NvcGUgIT09ICdsb2NhbCcpIHtcbiAgICAgICAgICBvcHRpb24uY2FsbGJhY2sodmFsdWUsIHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNjb3BlICE9PSAnZ2xvYmFsJyAmJiBjbSkge1xuICAgICAgICAgIG9wdGlvbi5jYWxsYmFjayh2YWx1ZSwgY20pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc2NvcGUgIT09ICdsb2NhbCcpIHtcbiAgICAgICAgICBvcHRpb24udmFsdWUgPSBvcHRpb24udHlwZSA9PSAnYm9vbGVhbicgPyAhIXZhbHVlIDogdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNjb3BlICE9PSAnZ2xvYmFsJyAmJiBjbSkge1xuICAgICAgICAgIGNtLnN0YXRlLnZpbS5vcHRpb25zW25hbWVdID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPcHRpb24obmFtZSwgY20sIGNmZykge1xuICAgICAgdmFyIG9wdGlvbiA9IG9wdGlvbnNbbmFtZV07XG4gICAgICBjZmcgPSBjZmcgfHwge307XG4gICAgICB2YXIgc2NvcGUgPSBjZmcuc2NvcGU7XG4gICAgICBpZiAoIW9wdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdVbmtub3duIG9wdGlvbjogJyArIG5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbi5jYWxsYmFjaykge1xuICAgICAgICB2YXIgbG9jYWwgPSBjbSAmJiBvcHRpb24uY2FsbGJhY2sodW5kZWZpbmVkLCBjbSk7XG4gICAgICAgIGlmIChzY29wZSAhPT0gJ2dsb2JhbCcgJiYgbG9jYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBsb2NhbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NvcGUgIT09ICdsb2NhbCcpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9uLmNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGxvY2FsID0gKHNjb3BlICE9PSAnZ2xvYmFsJykgJiYgKGNtICYmIGNtLnN0YXRlLnZpbS5vcHRpb25zW25hbWVdKTtcbiAgICAgICAgcmV0dXJuIChsb2NhbCB8fCAoc2NvcGUgIT09ICdsb2NhbCcpICYmIG9wdGlvbiB8fCB7fSkudmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVmaW5lT3B0aW9uKCdmaWxldHlwZScsIHVuZGVmaW5lZCwgJ3N0cmluZycsIFsnZnQnXSwgZnVuY3Rpb24obmFtZSwgY20pIHtcbiAgICAgIC8vIE9wdGlvbiBpcyBsb2NhbC4gRG8gbm90aGluZyBmb3IgZ2xvYmFsLlxuICAgICAgaWYgKGNtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gVGhlICdmaWxldHlwZScgb3B0aW9uIHByb3hpZXMgdG8gdGhlIENvZGVNaXJyb3IgJ21vZGUnIG9wdGlvbi5cbiAgICAgIGlmIChuYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIG1vZGUgPSBjbS5nZXRPcHRpb24oJ21vZGUnKTtcbiAgICAgICAgcmV0dXJuIG1vZGUgPT0gJ251bGwnID8gJycgOiBtb2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG1vZGUgPSBuYW1lID09ICcnID8gJ251bGwnIDogbmFtZTtcbiAgICAgICAgY20uc2V0T3B0aW9uKCdtb2RlJywgbW9kZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgY3JlYXRlQ2lyY3VsYXJKdW1wTGlzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNpemUgPSAxMDA7XG4gICAgICB2YXIgcG9pbnRlciA9IC0xO1xuICAgICAgdmFyIGhlYWQgPSAwO1xuICAgICAgdmFyIHRhaWwgPSAwO1xuICAgICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheShzaXplKTtcbiAgICAgIGZ1bmN0aW9uIGFkZChjbSwgb2xkQ3VyLCBuZXdDdXIpIHtcbiAgICAgICAgdmFyIGN1cnJlbnQgPSBwb2ludGVyICUgc2l6ZTtcbiAgICAgICAgdmFyIGN1ck1hcmsgPSBidWZmZXJbY3VycmVudF07XG4gICAgICAgIGZ1bmN0aW9uIHVzZU5leHRTbG90KGN1cnNvcikge1xuICAgICAgICAgIHZhciBuZXh0ID0gKytwb2ludGVyICUgc2l6ZTtcbiAgICAgICAgICB2YXIgdHJhc2hNYXJrID0gYnVmZmVyW25leHRdO1xuICAgICAgICAgIGlmICh0cmFzaE1hcmspIHtcbiAgICAgICAgICAgIHRyYXNoTWFyay5jbGVhcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBidWZmZXJbbmV4dF0gPSBjbS5zZXRCb29rbWFyayhjdXJzb3IpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJNYXJrKSB7XG4gICAgICAgICAgdmFyIG1hcmtQb3MgPSBjdXJNYXJrLmZpbmQoKTtcbiAgICAgICAgICAvLyBhdm9pZCByZWNvcmRpbmcgcmVkdW5kYW50IGN1cnNvciBwb3NpdGlvblxuICAgICAgICAgIGlmIChtYXJrUG9zICYmICFjdXJzb3JFcXVhbChtYXJrUG9zLCBvbGRDdXIpKSB7XG4gICAgICAgICAgICB1c2VOZXh0U2xvdChvbGRDdXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1c2VOZXh0U2xvdChvbGRDdXIpO1xuICAgICAgICB9XG4gICAgICAgIHVzZU5leHRTbG90KG5ld0N1cik7XG4gICAgICAgIGhlYWQgPSBwb2ludGVyO1xuICAgICAgICB0YWlsID0gcG9pbnRlciAtIHNpemUgKyAxO1xuICAgICAgICBpZiAodGFpbCA8IDApIHtcbiAgICAgICAgICB0YWlsID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuY3Rpb24gbW92ZShjbSwgb2Zmc2V0KSB7XG4gICAgICAgIHBvaW50ZXIgKz0gb2Zmc2V0O1xuICAgICAgICBpZiAocG9pbnRlciA+IGhlYWQpIHtcbiAgICAgICAgICBwb2ludGVyID0gaGVhZDtcbiAgICAgICAgfSBlbHNlIGlmIChwb2ludGVyIDwgdGFpbCkge1xuICAgICAgICAgIHBvaW50ZXIgPSB0YWlsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXJrID0gYnVmZmVyWyhzaXplICsgcG9pbnRlcikgJSBzaXplXTtcbiAgICAgICAgLy8gc2tpcCBtYXJrcyB0aGF0IGFyZSB0ZW1wb3JhcmlseSByZW1vdmVkIGZyb20gdGV4dCBidWZmZXJcbiAgICAgICAgaWYgKG1hcmsgJiYgIW1hcmsuZmluZCgpKSB7XG4gICAgICAgICAgdmFyIGluYyA9IG9mZnNldCA+IDAgPyAxIDogLTE7XG4gICAgICAgICAgdmFyIG5ld0N1cjtcbiAgICAgICAgICB2YXIgb2xkQ3VyID0gY20uZ2V0Q3Vyc29yKCk7XG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgcG9pbnRlciArPSBpbmM7XG4gICAgICAgICAgICBtYXJrID0gYnVmZmVyWyhzaXplICsgcG9pbnRlcikgJSBzaXplXTtcbiAgICAgICAgICAgIC8vIHNraXAgbWFya3MgdGhhdCBhcmUgdGhlIHNhbWUgYXMgY3VycmVudCBwb3NpdGlvblxuICAgICAgICAgICAgaWYgKG1hcmsgJiZcbiAgICAgICAgICAgICAgICAobmV3Q3VyID0gbWFyay5maW5kKCkpICYmXG4gICAgICAgICAgICAgICAgIWN1cnNvckVxdWFsKG9sZEN1ciwgbmV3Q3VyKSkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IHdoaWxlIChwb2ludGVyIDwgaGVhZCAmJiBwb2ludGVyID4gdGFpbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcms7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjYWNoZWRDdXJzb3I6IHVuZGVmaW5lZCwgLy91c2VkIGZvciAjIGFuZCAqIGp1bXBzXG4gICAgICAgIGFkZDogYWRkLFxuICAgICAgICBtb3ZlOiBtb3ZlXG4gICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBSZXR1cm5zIGFuIG9iamVjdCB0byB0cmFjayB0aGUgY2hhbmdlcyBhc3NvY2lhdGVkIGluc2VydCBtb2RlLiAgSXRcbiAgICAvLyBjbG9uZXMgdGhlIG9iamVjdCB0aGF0IGlzIHBhc3NlZCBpbiwgb3IgY3JlYXRlcyBhbiBlbXB0eSBvYmplY3Qgb25lIGlmXG4gICAgLy8gbm9uZSBpcyBwcm92aWRlZC5cbiAgICB2YXIgY3JlYXRlSW5zZXJ0TW9kZUNoYW5nZXMgPSBmdW5jdGlvbihjKSB7XG4gICAgICBpZiAoYykge1xuICAgICAgICAvLyBDb3B5IGNvbnN0cnVjdGlvblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNoYW5nZXM6IGMuY2hhbmdlcyxcbiAgICAgICAgICBleHBlY3RDdXJzb3JBY3Rpdml0eUZvckNoYW5nZTogYy5leHBlY3RDdXJzb3JBY3Rpdml0eUZvckNoYW5nZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gQ2hhbmdlIGxpc3RcbiAgICAgICAgY2hhbmdlczogW10sXG4gICAgICAgIC8vIFNldCB0byB0cnVlIG9uIGNoYW5nZSwgZmFsc2Ugb24gY3Vyc29yQWN0aXZpdHkuXG4gICAgICAgIGV4cGVjdEN1cnNvckFjdGl2aXR5Rm9yQ2hhbmdlOiBmYWxzZVxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gTWFjcm9Nb2RlU3RhdGUoKSB7XG4gICAgICB0aGlzLmxhdGVzdFJlZ2lzdGVyID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuaXNSZWNvcmRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVwbGF5U2VhcmNoUXVlcmllcyA9IFtdO1xuICAgICAgdGhpcy5vblJlY29yZGluZ0RvbmUgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcyA9IGNyZWF0ZUluc2VydE1vZGVDaGFuZ2VzKCk7XG4gICAgfVxuICAgIE1hY3JvTW9kZVN0YXRlLnByb3RvdHlwZSA9IHtcbiAgICAgIGV4aXRNYWNyb1JlY29yZE1vZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLm9uUmVjb3JkaW5nRG9uZSkge1xuICAgICAgICAgIG1hY3JvTW9kZVN0YXRlLm9uUmVjb3JkaW5nRG9uZSgpOyAvLyBjbG9zZSBkaWFsb2dcbiAgICAgICAgfVxuICAgICAgICBtYWNyb01vZGVTdGF0ZS5vblJlY29yZGluZ0RvbmUgPSB1bmRlZmluZWQ7XG4gICAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUmVjb3JkaW5nID0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgZW50ZXJNYWNyb1JlY29yZE1vZGU6IGZ1bmN0aW9uKGNtLCByZWdpc3Rlck5hbWUpIHtcbiAgICAgICAgdmFyIHJlZ2lzdGVyID1cbiAgICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5nZXRSZWdpc3RlcihyZWdpc3Rlck5hbWUpO1xuICAgICAgICBpZiAocmVnaXN0ZXIpIHtcbiAgICAgICAgICByZWdpc3Rlci5jbGVhcigpO1xuICAgICAgICAgIHRoaXMubGF0ZXN0UmVnaXN0ZXIgPSByZWdpc3Rlck5hbWU7XG4gICAgICAgICAgaWYgKGNtLm9wZW5EaWFsb2cpIHtcbiAgICAgICAgICAgIHRoaXMub25SZWNvcmRpbmdEb25lID0gY20ub3BlbkRpYWxvZyhcbiAgICAgICAgICAgICAgICAnKHJlY29yZGluZylbJytyZWdpc3Rlck5hbWUrJ10nLCBudWxsLCB7Ym90dG9tOnRydWV9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pc1JlY29yZGluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbWF5YmVJbml0VmltU3RhdGUoY20pIHtcbiAgICAgIGlmICghY20uc3RhdGUudmltKSB7XG4gICAgICAgIC8vIFN0b3JlIGluc3RhbmNlIHN0YXRlIGluIHRoZSBDb2RlTWlycm9yIG9iamVjdC5cbiAgICAgICAgY20uc3RhdGUudmltID0ge1xuICAgICAgICAgIGlucHV0U3RhdGU6IG5ldyBJbnB1dFN0YXRlKCksXG4gICAgICAgICAgLy8gVmltJ3MgaW5wdXQgc3RhdGUgdGhhdCB0cmlnZ2VyZWQgdGhlIGxhc3QgZWRpdCwgdXNlZCB0byByZXBlYXRcbiAgICAgICAgICAvLyBtb3Rpb25zIGFuZCBvcGVyYXRvcnMgd2l0aCAnLicuXG4gICAgICAgICAgbGFzdEVkaXRJbnB1dFN0YXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgLy8gVmltJ3MgYWN0aW9uIGNvbW1hbmQgYmVmb3JlIHRoZSBsYXN0IGVkaXQsIHVzZWQgdG8gcmVwZWF0IGFjdGlvbnNcbiAgICAgICAgICAvLyB3aXRoICcuJyBhbmQgaW5zZXJ0IG1vZGUgcmVwZWF0LlxuICAgICAgICAgIGxhc3RFZGl0QWN0aW9uQ29tbWFuZDogdW5kZWZpbmVkLFxuICAgICAgICAgIC8vIFdoZW4gdXNpbmcgamsgZm9yIG5hdmlnYXRpb24sIGlmIHlvdSBtb3ZlIGZyb20gYSBsb25nZXIgbGluZSB0byBhXG4gICAgICAgICAgLy8gc2hvcnRlciBsaW5lLCB0aGUgY3Vyc29yIG1heSBjbGlwIHRvIHRoZSBlbmQgb2YgdGhlIHNob3J0ZXIgbGluZS5cbiAgICAgICAgICAvLyBJZiBqIGlzIHByZXNzZWQgYWdhaW4gYW5kIGN1cnNvciBnb2VzIHRvIHRoZSBuZXh0IGxpbmUsIHRoZVxuICAgICAgICAgIC8vIGN1cnNvciBzaG91bGQgZ28gYmFjayB0byBpdHMgaG9yaXpvbnRhbCBwb3NpdGlvbiBvbiB0aGUgbG9uZ2VyXG4gICAgICAgICAgLy8gbGluZSBpZiBpdCBjYW4uIFRoaXMgaXMgdG8ga2VlcCB0cmFjayBvZiB0aGUgaG9yaXpvbnRhbCBwb3NpdGlvbi5cbiAgICAgICAgICBsYXN0SFBvczogLTEsXG4gICAgICAgICAgLy8gRG9pbmcgdGhlIHNhbWUgd2l0aCBzY3JlZW4tcG9zaXRpb24gZm9yIGdqL2drXG4gICAgICAgICAgbGFzdEhTUG9zOiAtMSxcbiAgICAgICAgICAvLyBUaGUgbGFzdCBtb3Rpb24gY29tbWFuZCBydW4uIENsZWFyZWQgaWYgYSBub24tbW90aW9uIGNvbW1hbmQgZ2V0c1xuICAgICAgICAgIC8vIGV4ZWN1dGVkIGluIGJldHdlZW4uXG4gICAgICAgICAgbGFzdE1vdGlvbjogbnVsbCxcbiAgICAgICAgICBtYXJrczoge30sXG4gICAgICAgICAgLy8gTWFyayBmb3IgcmVuZGVyaW5nIGZha2UgY3Vyc29yIGZvciB2aXN1YWwgbW9kZS5cbiAgICAgICAgICBmYWtlQ3Vyc29yOiBudWxsLFxuICAgICAgICAgIGluc2VydE1vZGU6IGZhbHNlLFxuICAgICAgICAgIC8vIFJlcGVhdCBjb3VudCBmb3IgY2hhbmdlcyBtYWRlIGluIGluc2VydCBtb2RlLCB0cmlnZ2VyZWQgYnkga2V5XG4gICAgICAgICAgLy8gc2VxdWVuY2VzIGxpa2UgMyxpLiBPbmx5IGV4aXN0cyB3aGVuIGluc2VydE1vZGUgaXMgdHJ1ZS5cbiAgICAgICAgICBpbnNlcnRNb2RlUmVwZWF0OiB1bmRlZmluZWQsXG4gICAgICAgICAgdmlzdWFsTW9kZTogZmFsc2UsXG4gICAgICAgICAgLy8gSWYgd2UgYXJlIGluIHZpc3VhbCBsaW5lIG1vZGUuIE5vIGVmZmVjdCBpZiB2aXN1YWxNb2RlIGlzIGZhbHNlLlxuICAgICAgICAgIHZpc3VhbExpbmU6IGZhbHNlLFxuICAgICAgICAgIHZpc3VhbEJsb2NrOiBmYWxzZSxcbiAgICAgICAgICBsYXN0U2VsZWN0aW9uOiBudWxsLFxuICAgICAgICAgIGxhc3RQYXN0ZWRUZXh0OiBudWxsLFxuICAgICAgICAgIHNlbDoge30sXG4gICAgICAgICAgLy8gQnVmZmVyLWxvY2FsL3dpbmRvdy1sb2NhbCB2YWx1ZXMgb2YgdmltIG9wdGlvbnMuXG4gICAgICAgICAgb3B0aW9uczoge31cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjbS5zdGF0ZS52aW07XG4gICAgfVxuICAgIHZhciB2aW1HbG9iYWxTdGF0ZTtcbiAgICBmdW5jdGlvbiByZXNldFZpbUdsb2JhbFN0YXRlKCkge1xuICAgICAgdmltR2xvYmFsU3RhdGUgPSB7XG4gICAgICAgIC8vIFRoZSBjdXJyZW50IHNlYXJjaCBxdWVyeS5cbiAgICAgICAgc2VhcmNoUXVlcnk6IG51bGwsXG4gICAgICAgIC8vIFdoZXRoZXIgd2UgYXJlIHNlYXJjaGluZyBiYWNrd2FyZHMuXG4gICAgICAgIHNlYXJjaElzUmV2ZXJzZWQ6IGZhbHNlLFxuICAgICAgICAvLyBSZXBsYWNlIHBhcnQgb2YgdGhlIGxhc3Qgc3Vic3RpdHV0ZWQgcGF0dGVyblxuICAgICAgICBsYXN0U3Vic3RpdHV0ZVJlcGxhY2VQYXJ0OiB1bmRlZmluZWQsXG4gICAgICAgIGp1bXBMaXN0OiBjcmVhdGVDaXJjdWxhckp1bXBMaXN0KCksXG4gICAgICAgIG1hY3JvTW9kZVN0YXRlOiBuZXcgTWFjcm9Nb2RlU3RhdGUsXG4gICAgICAgIC8vIFJlY29yZGluZyBsYXRlc3QgZiwgdCwgRiBvciBUIG1vdGlvbiBjb21tYW5kLlxuICAgICAgICBsYXN0Q2hhcmFjdGVyU2VhcmNoOiB7aW5jcmVtZW50OjAsIGZvcndhcmQ6dHJ1ZSwgc2VsZWN0ZWRDaGFyYWN0ZXI6Jyd9LFxuICAgICAgICByZWdpc3RlckNvbnRyb2xsZXI6IG5ldyBSZWdpc3RlckNvbnRyb2xsZXIoe30pLFxuICAgICAgICAvLyBzZWFyY2ggaGlzdG9yeSBidWZmZXJcbiAgICAgICAgc2VhcmNoSGlzdG9yeUNvbnRyb2xsZXI6IG5ldyBIaXN0b3J5Q29udHJvbGxlcigpLFxuICAgICAgICAvLyBleCBDb21tYW5kIGhpc3RvcnkgYnVmZmVyXG4gICAgICAgIGV4Q29tbWFuZEhpc3RvcnlDb250cm9sbGVyIDogbmV3IEhpc3RvcnlDb250cm9sbGVyKClcbiAgICAgIH07XG4gICAgICBmb3IgKHZhciBvcHRpb25OYW1lIGluIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IG9wdGlvbnNbb3B0aW9uTmFtZV07XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IG9wdGlvbi5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxhc3RJbnNlcnRNb2RlS2V5VGltZXI7XG4gICAgdmFyIHZpbUFwaT0ge1xuICAgICAgYnVpbGRLZXlNYXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBUT0RPOiBDb252ZXJ0IGtleW1hcCBpbnRvIGRpY3Rpb25hcnkgZm9ybWF0IGZvciBmYXN0IGxvb2t1cC5cbiAgICAgIH0sXG4gICAgICAvLyBUZXN0aW5nIGhvb2ssIHRob3VnaCBpdCBtaWdodCBiZSB1c2VmdWwgdG8gZXhwb3NlIHRoZSByZWdpc3RlclxuICAgICAgLy8gY29udHJvbGxlciBhbnl3YXlzLlxuICAgICAgZ2V0UmVnaXN0ZXJDb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlcjtcbiAgICAgIH0sXG4gICAgICAvLyBUZXN0aW5nIGhvb2suXG4gICAgICByZXNldFZpbUdsb2JhbFN0YXRlXzogcmVzZXRWaW1HbG9iYWxTdGF0ZSxcblxuICAgICAgLy8gVGVzdGluZyBob29rLlxuICAgICAgZ2V0VmltR2xvYmFsU3RhdGVfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZpbUdsb2JhbFN0YXRlO1xuICAgICAgfSxcblxuICAgICAgLy8gVGVzdGluZyBob29rLlxuICAgICAgbWF5YmVJbml0VmltU3RhdGVfOiBtYXliZUluaXRWaW1TdGF0ZSxcblxuICAgICAgc3VwcHJlc3NFcnJvckxvZ2dpbmc6IGZhbHNlLFxuXG4gICAgICBJbnNlcnRNb2RlS2V5OiBJbnNlcnRNb2RlS2V5LFxuICAgICAgbWFwOiBmdW5jdGlvbihsaHMsIHJocywgY3R4KSB7XG4gICAgICAgIC8vIEFkZCB1c2VyIGRlZmluZWQga2V5IGJpbmRpbmdzLlxuICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLm1hcChsaHMsIHJocywgY3R4KTtcbiAgICAgIH0sXG4gICAgICB1bm1hcDogZnVuY3Rpb24obGhzLCBjdHgpIHtcbiAgICAgICAgZXhDb21tYW5kRGlzcGF0Y2hlci51bm1hcChsaHMsIGN0eCk7XG4gICAgICB9LFxuICAgICAgLy8gTm9uLXJlY3Vyc2l2ZSBtYXAgZnVuY3Rpb24uXG4gICAgICAvLyBOT1RFOiBUaGlzIHdpbGwgbm90IGNyZWF0ZSBtYXBwaW5ncyB0byBrZXkgbWFwcyB0aGF0IGFyZW4ndCBwcmVzZW50XG4gICAgICAvLyBpbiB0aGUgZGVmYXVsdCBrZXkgbWFwLiBTZWUgVE9ETyBhdCBib3R0b20gb2YgZnVuY3Rpb24uXG4gICAgICBub3JlbWFwOiBmdW5jdGlvbihsaHMsIHJocywgY3R4KSB7XG4gICAgICAgIGZ1bmN0aW9uIHRvQ3R4QXJyYXkoY3R4KSB7XG4gICAgICAgICAgcmV0dXJuIGN0eCA/IFtjdHhdIDogWydub3JtYWwnLCAnaW5zZXJ0JywgJ3Zpc3VhbCddO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdHhzVG9NYXAgPSB0b0N0eEFycmF5KGN0eCk7XG4gICAgICAgIC8vIExvb2sgdGhyb3VnaCBhbGwgYWN0dWFsIGRlZmF1bHRzIHRvIGZpbmQgYSBtYXAgY2FuZGlkYXRlLlxuICAgICAgICB2YXIgYWN0dWFsTGVuZ3RoID0gZGVmYXVsdEtleW1hcC5sZW5ndGgsIG9yaWdMZW5ndGggPSBkZWZhdWx0S2V5bWFwTGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gYWN0dWFsTGVuZ3RoIC0gb3JpZ0xlbmd0aDtcbiAgICAgICAgICAgICBpIDwgYWN0dWFsTGVuZ3RoICYmIGN0eHNUb01hcC5sZW5ndGg7XG4gICAgICAgICAgICAgaSsrKSB7XG4gICAgICAgICAgdmFyIG1hcHBpbmcgPSBkZWZhdWx0S2V5bWFwW2ldO1xuICAgICAgICAgIC8vIE9taXQgbWFwcGluZ3MgdGhhdCBvcGVyYXRlIGluIHRoZSB3cm9uZyBjb250ZXh0KHMpIGFuZCB0aG9zZSBvZiBpbnZhbGlkIHR5cGUuXG4gICAgICAgICAgaWYgKG1hcHBpbmcua2V5cyA9PSByaHMgJiZcbiAgICAgICAgICAgICAgKCFjdHggfHwgIW1hcHBpbmcuY29udGV4dCB8fCBtYXBwaW5nLmNvbnRleHQgPT09IGN0eCkgJiZcbiAgICAgICAgICAgICAgbWFwcGluZy50eXBlLnN1YnN0cigwLCAyKSAhPT0gJ2V4JyAmJlxuICAgICAgICAgICAgICBtYXBwaW5nLnR5cGUuc3Vic3RyKDAsIDMpICE9PSAna2V5Jykge1xuICAgICAgICAgICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weSBvZiB0aGUgb3JpZ2luYWwga2V5bWFwIGVudHJ5LlxuICAgICAgICAgICAgdmFyIG5ld01hcHBpbmcgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBtYXBwaW5nKSB7XG4gICAgICAgICAgICAgIG5ld01hcHBpbmdba2V5XSA9IG1hcHBpbmdba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1vZGlmeSBpdCBwb2ludCB0byB0aGUgbmV3IG1hcHBpbmcgd2l0aCB0aGUgcHJvcGVyIGNvbnRleHQuXG4gICAgICAgICAgICBuZXdNYXBwaW5nLmtleXMgPSBsaHM7XG4gICAgICAgICAgICBpZiAoY3R4ICYmICFuZXdNYXBwaW5nLmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgbmV3TWFwcGluZy5jb250ZXh0ID0gY3R4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQWRkIGl0IHRvIHRoZSBrZXltYXAgd2l0aCBhIGhpZ2hlciBwcmlvcml0eSB0aGFuIHRoZSBvcmlnaW5hbC5cbiAgICAgICAgICAgIHRoaXMuX21hcENvbW1hbmQobmV3TWFwcGluZyk7XG4gICAgICAgICAgICAvLyBSZWNvcmQgdGhlIG1hcHBlZCBjb250ZXh0cyBhcyBjb21wbGV0ZS5cbiAgICAgICAgICAgIHZhciBtYXBwZWRDdHhzID0gdG9DdHhBcnJheShtYXBwaW5nLmNvbnRleHQpO1xuICAgICAgICAgICAgY3R4c1RvTWFwID0gY3R4c1RvTWFwLmZpbHRlcihmdW5jdGlvbihlbCkgeyByZXR1cm4gbWFwcGVkQ3R4cy5pbmRleE9mKGVsKSA9PT0gLTE7IH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiBDcmVhdGUgbm9uLXJlY3Vyc2l2ZSBrZXlUb0tleSBtYXBwaW5ncyBmb3IgdGhlIHVubWFwcGVkIGNvbnRleHRzIG9uY2UgdGhvc2UgZXhpc3QuXG4gICAgICB9LFxuICAgICAgLy8gUmVtb3ZlIGFsbCB1c2VyLWRlZmluZWQgbWFwcGluZ3MgZm9yIHRoZSBwcm92aWRlZCBjb250ZXh0LlxuICAgICAgbWFwY2xlYXI6IGZ1bmN0aW9uKGN0eCkge1xuICAgICAgICAvLyBQYXJ0aXRpb24gdGhlIGV4aXN0aW5nIGtleW1hcCBpbnRvIHVzZXItZGVmaW5lZCBhbmQgdHJ1ZSBkZWZhdWx0cy5cbiAgICAgICAgdmFyIGFjdHVhbExlbmd0aCA9IGRlZmF1bHRLZXltYXAubGVuZ3RoLFxuICAgICAgICAgICAgb3JpZ0xlbmd0aCA9IGRlZmF1bHRLZXltYXBMZW5ndGg7XG4gICAgICAgIHZhciB1c2VyS2V5bWFwID0gZGVmYXVsdEtleW1hcC5zbGljZSgwLCBhY3R1YWxMZW5ndGggLSBvcmlnTGVuZ3RoKTtcbiAgICAgICAgZGVmYXVsdEtleW1hcCA9IGRlZmF1bHRLZXltYXAuc2xpY2UoYWN0dWFsTGVuZ3RoIC0gb3JpZ0xlbmd0aCk7XG4gICAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgICAvLyBJZiBhIHNwZWNpZmljIGNvbnRleHQgaXMgYmVpbmcgY2xlYXJlZCwgd2UgbmVlZCB0byBrZWVwIG1hcHBpbmdzXG4gICAgICAgICAgLy8gZnJvbSBhbGwgb3RoZXIgY29udGV4dHMuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IHVzZXJLZXltYXAubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBtYXBwaW5nID0gdXNlcktleW1hcFtpXTtcbiAgICAgICAgICAgIGlmIChjdHggIT09IG1hcHBpbmcuY29udGV4dCkge1xuICAgICAgICAgICAgICBpZiAobWFwcGluZy5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwQ29tbWFuZChtYXBwaW5nKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBgbWFwcGluZ2AgYXBwbGllcyB0byBhbGwgY29udGV4dHMgc28gY3JlYXRlIGtleW1hcCBjb3BpZXNcbiAgICAgICAgICAgICAgICAvLyBmb3IgZWFjaCBjb250ZXh0IGV4Y2VwdCB0aGUgb25lIGJlaW5nIGNsZWFyZWQuXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHRzID0gWydub3JtYWwnLCAnaW5zZXJ0JywgJ3Zpc3VhbCddO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gY29udGV4dHMpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChjb250ZXh0c1tqXSAhPT0gY3R4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdNYXBwaW5nID0ge307XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBtYXBwaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbmV3TWFwcGluZ1trZXldID0gbWFwcGluZ1trZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld01hcHBpbmcuY29udGV4dCA9IGNvbnRleHRzW2pdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXBDb21tYW5kKG5ld01hcHBpbmcpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIFRPRE86IEV4cG9zZSBzZXRPcHRpb24gYW5kIGdldE9wdGlvbiBhcyBpbnN0YW5jZSBtZXRob2RzLiBOZWVkIHRvIGRlY2lkZSBob3cgdG8gbmFtZXNwYWNlXG4gICAgICAvLyB0aGVtLCBvciBzb21laG93IG1ha2UgdGhlbSB3b3JrIHdpdGggdGhlIGV4aXN0aW5nIENvZGVNaXJyb3Igc2V0T3B0aW9uL2dldE9wdGlvbiBBUEkuXG4gICAgICBzZXRPcHRpb246IHNldE9wdGlvbixcbiAgICAgIGdldE9wdGlvbjogZ2V0T3B0aW9uLFxuICAgICAgZGVmaW5lT3B0aW9uOiBkZWZpbmVPcHRpb24sXG4gICAgICBkZWZpbmVFeDogZnVuY3Rpb24obmFtZSwgcHJlZml4LCBmdW5jKXtcbiAgICAgICAgaWYgKCFwcmVmaXgpIHtcbiAgICAgICAgICBwcmVmaXggPSBuYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKG5hbWUuaW5kZXhPZihwcmVmaXgpICE9PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCcoVmltLmRlZmluZUV4KSBcIicrcHJlZml4KydcIiBpcyBub3QgYSBwcmVmaXggb2YgXCInK25hbWUrJ1wiLCBjb21tYW5kIG5vdCByZWdpc3RlcmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZXhDb21tYW5kc1tuYW1lXT1mdW5jO1xuICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLmNvbW1hbmRNYXBfW3ByZWZpeF09e25hbWU6bmFtZSwgc2hvcnROYW1lOnByZWZpeCwgdHlwZTonYXBpJ307XG4gICAgICB9LFxuICAgICAgaGFuZGxlS2V5OiBmdW5jdGlvbiAoY20sIGtleSwgb3JpZ2luKSB7XG4gICAgICAgIHZhciBjb21tYW5kID0gdGhpcy5maW5kS2V5KGNtLCBrZXksIG9yaWdpbik7XG4gICAgICAgIGlmICh0eXBlb2YgY29tbWFuZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBjb21tYW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgaXMgdGhlIG91dGVybW9zdCBmdW5jdGlvbiBjYWxsZWQgYnkgQ29kZU1pcnJvciwgYWZ0ZXIga2V5cyBoYXZlXG4gICAgICAgKiBiZWVuIG1hcHBlZCB0byB0aGVpciBWaW0gZXF1aXZhbGVudHMuXG4gICAgICAgKlxuICAgICAgICogRmluZHMgYSBjb21tYW5kIGJhc2VkIG9uIHRoZSBrZXkgKGFuZCBjYWNoZWQga2V5cyBpZiB0aGVyZSBpcyBhXG4gICAgICAgKiBtdWx0aS1rZXkgc2VxdWVuY2UpLiBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIG5vIGtleSBpcyBtYXRjaGVkLCBhIG5vb3BcbiAgICAgICAqIGZ1bmN0aW9uIGlmIGEgcGFydGlhbCBtYXRjaCBpcyBmb3VuZCAobXVsdGkta2V5KSwgYW5kIGEgZnVuY3Rpb24gdG9cbiAgICAgICAqIGV4ZWN1dGUgdGhlIGJvdW5kIGNvbW1hbmQgaWYgYSBhIGtleSBpcyBtYXRjaGVkLiBUaGUgZnVuY3Rpb24gYWx3YXlzXG4gICAgICAgKiByZXR1cm5zIHRydWUuXG4gICAgICAgKi9cbiAgICAgIGZpbmRLZXk6IGZ1bmN0aW9uKGNtLCBrZXksIG9yaWdpbikge1xuICAgICAgICB2YXIgdmltID0gbWF5YmVJbml0VmltU3RhdGUoY20pO1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVNYWNyb1JlY29yZGluZygpIHtcbiAgICAgICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgICAgICBpZiAobWFjcm9Nb2RlU3RhdGUuaXNSZWNvcmRpbmcpIHtcbiAgICAgICAgICAgIGlmIChrZXkgPT0gJ3EnKSB7XG4gICAgICAgICAgICAgIG1hY3JvTW9kZVN0YXRlLmV4aXRNYWNyb1JlY29yZE1vZGUoKTtcbiAgICAgICAgICAgICAgY2xlYXJJbnB1dFN0YXRlKGNtKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3JpZ2luICE9ICdtYXBwaW5nJykge1xuICAgICAgICAgICAgICBsb2dLZXkobWFjcm9Nb2RlU3RhdGUsIGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUVzYygpIHtcbiAgICAgICAgICBpZiAoa2V5ID09ICc8RXNjPicpIHtcbiAgICAgICAgICAgIC8vIENsZWFyIGlucHV0IHN0YXRlIGFuZCBnZXQgYmFjayB0byBub3JtYWwgbW9kZS5cbiAgICAgICAgICAgIGNsZWFySW5wdXRTdGF0ZShjbSk7XG4gICAgICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2aW0uaW5zZXJ0TW9kZSkge1xuICAgICAgICAgICAgICBleGl0SW5zZXJ0TW9kZShjbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZG9LZXlUb0tleShrZXlzKSB7XG4gICAgICAgICAgLy8gVE9ETzogcHJldmVudCBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICAgIHdoaWxlIChrZXlzKSB7XG4gICAgICAgICAgICAvLyBQdWxsIG9mZiBvbmUgY29tbWFuZCBrZXksIHdoaWNoIGlzIGVpdGhlciBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAgICAgICAgIC8vIG9yIGEgc3BlY2lhbCBzZXF1ZW5jZSB3cmFwcGVkIGluICc8JyBhbmQgJz4nLCBlLmcuICc8U3BhY2U+Jy5cbiAgICAgICAgICAgIG1hdGNoID0gKC88XFx3Ky0uKz8+fDxcXHcrPnwuLykuZXhlYyhrZXlzKTtcbiAgICAgICAgICAgIGtleSA9IG1hdGNoWzBdO1xuICAgICAgICAgICAga2V5cyA9IGtleXMuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsga2V5Lmxlbmd0aCk7XG4gICAgICAgICAgICBDb2RlTWlycm9yLlZpbS5oYW5kbGVLZXkoY20sIGtleSwgJ21hcHBpbmcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlJbnNlcnRNb2RlKCkge1xuICAgICAgICAgIGlmIChoYW5kbGVFc2MoKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICAgIHZhciBrZXlzID0gdmltLmlucHV0U3RhdGUua2V5QnVmZmVyID0gdmltLmlucHV0U3RhdGUua2V5QnVmZmVyICsga2V5O1xuICAgICAgICAgIHZhciBrZXlzQXJlQ2hhcnMgPSBrZXkubGVuZ3RoID09IDE7XG4gICAgICAgICAgdmFyIG1hdGNoID0gY29tbWFuZERpc3BhdGNoZXIubWF0Y2hDb21tYW5kKGtleXMsIGRlZmF1bHRLZXltYXAsIHZpbS5pbnB1dFN0YXRlLCAnaW5zZXJ0Jyk7XG4gICAgICAgICAgLy8gTmVlZCB0byBjaGVjayBhbGwga2V5IHN1YnN0cmluZ3MgaW4gaW5zZXJ0IG1vZGUuXG4gICAgICAgICAgd2hpbGUgKGtleXMubGVuZ3RoID4gMSAmJiBtYXRjaC50eXBlICE9ICdmdWxsJykge1xuICAgICAgICAgICAgdmFyIGtleXMgPSB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIgPSBrZXlzLnNsaWNlKDEpO1xuICAgICAgICAgICAgdmFyIHRoaXNNYXRjaCA9IGNvbW1hbmREaXNwYXRjaGVyLm1hdGNoQ29tbWFuZChrZXlzLCBkZWZhdWx0S2V5bWFwLCB2aW0uaW5wdXRTdGF0ZSwgJ2luc2VydCcpO1xuICAgICAgICAgICAgaWYgKHRoaXNNYXRjaC50eXBlICE9ICdub25lJykgeyBtYXRjaCA9IHRoaXNNYXRjaDsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWF0Y2gudHlwZSA9PSAnbm9uZScpIHsgY2xlYXJJbnB1dFN0YXRlKGNtKTsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgICAgZWxzZSBpZiAobWF0Y2gudHlwZSA9PSAncGFydGlhbCcpIHtcbiAgICAgICAgICAgIGlmIChsYXN0SW5zZXJ0TW9kZUtleVRpbWVyKSB7IHdpbmRvdy5jbGVhclRpbWVvdXQobGFzdEluc2VydE1vZGVLZXlUaW1lcik7IH1cbiAgICAgICAgICAgIGxhc3RJbnNlcnRNb2RlS2V5VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChcbiAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IGlmICh2aW0uaW5zZXJ0TW9kZSAmJiB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIpIHsgY2xlYXJJbnB1dFN0YXRlKGNtKTsgfSB9LFxuICAgICAgICAgICAgICBnZXRPcHRpb24oJ2luc2VydE1vZGVFc2NLZXlzVGltZW91dCcpKTtcbiAgICAgICAgICAgIHJldHVybiAha2V5c0FyZUNoYXJzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChsYXN0SW5zZXJ0TW9kZUtleVRpbWVyKSB7IHdpbmRvdy5jbGVhclRpbWVvdXQobGFzdEluc2VydE1vZGVLZXlUaW1lcik7IH1cbiAgICAgICAgICBpZiAoa2V5c0FyZUNoYXJzKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0aW9ucyA9IGNtLmxpc3RTZWxlY3Rpb25zKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIGhlcmUgPSBzZWxlY3Rpb25zW2ldLmhlYWQ7XG4gICAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSgnJywgb2Zmc2V0Q3Vyc29yKGhlcmUsIDAsIC0oa2V5cy5sZW5ndGggLSAxKSksIGhlcmUsICcraW5wdXQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcy5jaGFuZ2VzLnBvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICAgIHJldHVybiBtYXRjaC5jb21tYW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlS2V5Tm9uSW5zZXJ0TW9kZSgpIHtcbiAgICAgICAgICBpZiAoaGFuZGxlTWFjcm9SZWNvcmRpbmcoKSB8fCBoYW5kbGVFc2MoKSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgICAgICAgdmFyIGtleXMgPSB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIgPSB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIgKyBrZXk7XG4gICAgICAgICAgaWYgKC9eWzEtOV1cXGQqJC8udGVzdChrZXlzKSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgICAgICAgdmFyIGtleXNNYXRjaGVyID0gL14oXFxkKikoLiopJC8uZXhlYyhrZXlzKTtcbiAgICAgICAgICBpZiAoIWtleXNNYXRjaGVyKSB7IGNsZWFySW5wdXRTdGF0ZShjbSk7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICAgIHZhciBjb250ZXh0ID0gdmltLnZpc3VhbE1vZGUgPyAndmlzdWFsJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdub3JtYWwnO1xuICAgICAgICAgIHZhciBtYXRjaCA9IGNvbW1hbmREaXNwYXRjaGVyLm1hdGNoQ29tbWFuZChrZXlzTWF0Y2hlclsyXSB8fCBrZXlzTWF0Y2hlclsxXSwgZGVmYXVsdEtleW1hcCwgdmltLmlucHV0U3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChtYXRjaC50eXBlID09ICdub25lJykgeyBjbGVhcklucHV0U3RhdGUoY20pOyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgICBlbHNlIGlmIChtYXRjaC50eXBlID09ICdwYXJ0aWFsJykgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgICAgICAgdmltLmlucHV0U3RhdGUua2V5QnVmZmVyID0gJyc7XG4gICAgICAgICAgdmFyIGtleXNNYXRjaGVyID0gL14oXFxkKikoLiopJC8uZXhlYyhrZXlzKTtcbiAgICAgICAgICBpZiAoa2V5c01hdGNoZXJbMV0gJiYga2V5c01hdGNoZXJbMV0gIT0gJzAnKSB7XG4gICAgICAgICAgICB2aW0uaW5wdXRTdGF0ZS5wdXNoUmVwZWF0RGlnaXQoa2V5c01hdGNoZXJbMV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbWF0Y2guY29tbWFuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb21tYW5kO1xuICAgICAgICBpZiAodmltLmluc2VydE1vZGUpIHsgY29tbWFuZCA9IGhhbmRsZUtleUluc2VydE1vZGUoKTsgfVxuICAgICAgICBlbHNlIHsgY29tbWFuZCA9IGhhbmRsZUtleU5vbkluc2VydE1vZGUoKTsgfVxuICAgICAgICBpZiAoY29tbWFuZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gIXZpbS5pbnNlcnRNb2RlICYmIGtleS5sZW5ndGggPT09IDEgPyBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWU7IH0gOiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIC8vIFRPRE86IExvb2sgaW50byB1c2luZyBDb2RlTWlycm9yJ3MgbXVsdGkta2V5IGhhbmRsaW5nLlxuICAgICAgICAgIC8vIFJldHVybiBuby1vcCBzaW5jZSB3ZSBhcmUgY2FjaGluZyB0aGUga2V5LiBDb3VudHMgYXMgaGFuZGxlZCwgYnV0XG4gICAgICAgICAgLy8gZG9uJ3Qgd2FudCBhY3Qgb24gaXQganVzdCB5ZXQuXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTsgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY20ub3BlcmF0aW9uKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBjbS5jdXJPcC5pc1ZpbU9wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC50eXBlID09ICdrZXlUb0tleScpIHtcbiAgICAgICAgICAgICAgICAgIGRvS2V5VG9LZXkoY29tbWFuZC50b0tleXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb21tYW5kRGlzcGF0Y2hlci5wcm9jZXNzQ29tbWFuZChjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBjbGVhciBWSU0gc3RhdGUgaW4gY2FzZSBpdCdzIGluIGEgYmFkIHN0YXRlLlxuICAgICAgICAgICAgICAgIGNtLnN0YXRlLnZpbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBtYXliZUluaXRWaW1TdGF0ZShjbSk7XG4gICAgICAgICAgICAgICAgaWYgKCFDb2RlTWlycm9yLlZpbS5zdXBwcmVzc0Vycm9yTG9nZ2luZykge1xuICAgICAgICAgICAgICAgICAgY29uc29sZVsnbG9nJ10oZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlRXg6IGZ1bmN0aW9uKGNtLCBpbnB1dCkge1xuICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLnByb2Nlc3NDb21tYW5kKGNtLCBpbnB1dCk7XG4gICAgICB9LFxuXG4gICAgICBkZWZpbmVNb3Rpb246IGRlZmluZU1vdGlvbixcbiAgICAgIGRlZmluZUFjdGlvbjogZGVmaW5lQWN0aW9uLFxuICAgICAgZGVmaW5lT3BlcmF0b3I6IGRlZmluZU9wZXJhdG9yLFxuICAgICAgbWFwQ29tbWFuZDogbWFwQ29tbWFuZCxcbiAgICAgIF9tYXBDb21tYW5kOiBfbWFwQ29tbWFuZCxcblxuICAgICAgZGVmaW5lUmVnaXN0ZXI6IGRlZmluZVJlZ2lzdGVyLFxuXG4gICAgICBleGl0VmlzdWFsTW9kZTogZXhpdFZpc3VhbE1vZGUsXG4gICAgICBleGl0SW5zZXJ0TW9kZTogZXhpdEluc2VydE1vZGVcbiAgICB9O1xuXG4gICAgLy8gUmVwcmVzZW50cyB0aGUgY3VycmVudCBpbnB1dCBzdGF0ZS5cbiAgICBmdW5jdGlvbiBJbnB1dFN0YXRlKCkge1xuICAgICAgdGhpcy5wcmVmaXhSZXBlYXQgPSBbXTtcbiAgICAgIHRoaXMubW90aW9uUmVwZWF0ID0gW107XG5cbiAgICAgIHRoaXMub3BlcmF0b3IgPSBudWxsO1xuICAgICAgdGhpcy5vcGVyYXRvckFyZ3MgPSBudWxsO1xuICAgICAgdGhpcy5tb3Rpb24gPSBudWxsO1xuICAgICAgdGhpcy5tb3Rpb25BcmdzID0gbnVsbDtcbiAgICAgIHRoaXMua2V5QnVmZmVyID0gW107IC8vIEZvciBtYXRjaGluZyBtdWx0aS1rZXkgY29tbWFuZHMuXG4gICAgICB0aGlzLnJlZ2lzdGVyTmFtZSA9IG51bGw7IC8vIERlZmF1bHRzIHRvIHRoZSB1bm5hbWVkIHJlZ2lzdGVyLlxuICAgIH1cbiAgICBJbnB1dFN0YXRlLnByb3RvdHlwZS5wdXNoUmVwZWF0RGlnaXQgPSBmdW5jdGlvbihuKSB7XG4gICAgICBpZiAoIXRoaXMub3BlcmF0b3IpIHtcbiAgICAgICAgdGhpcy5wcmVmaXhSZXBlYXQgPSB0aGlzLnByZWZpeFJlcGVhdC5jb25jYXQobik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vdGlvblJlcGVhdCA9IHRoaXMubW90aW9uUmVwZWF0LmNvbmNhdChuKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIElucHV0U3RhdGUucHJvdG90eXBlLmdldFJlcGVhdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlcGVhdCA9IDA7XG4gICAgICBpZiAodGhpcy5wcmVmaXhSZXBlYXQubGVuZ3RoID4gMCB8fCB0aGlzLm1vdGlvblJlcGVhdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlcGVhdCA9IDE7XG4gICAgICAgIGlmICh0aGlzLnByZWZpeFJlcGVhdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVwZWF0ICo9IHBhcnNlSW50KHRoaXMucHJlZml4UmVwZWF0LmpvaW4oJycpLCAxMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubW90aW9uUmVwZWF0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXBlYXQgKj0gcGFyc2VJbnQodGhpcy5tb3Rpb25SZXBlYXQuam9pbignJyksIDEwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcGVhdDtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2xlYXJJbnB1dFN0YXRlKGNtLCByZWFzb24pIHtcbiAgICAgIGNtLnN0YXRlLnZpbS5pbnB1dFN0YXRlID0gbmV3IElucHV0U3RhdGUoKTtcbiAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCAndmltLWNvbW1hbmQtZG9uZScsIHJlYXNvbik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZWdpc3RlciBzdG9yZXMgaW5mb3JtYXRpb24gYWJvdXQgY29weSBhbmQgcGFzdGUgcmVnaXN0ZXJzLiAgQmVzaWRlc1xuICAgICAqIHRleHQsIGEgcmVnaXN0ZXIgbXVzdCBzdG9yZSB3aGV0aGVyIGl0IGlzIGxpbmV3aXNlIChpLmUuLCB3aGVuIGl0IGlzXG4gICAgICogcGFzdGVkLCBzaG91bGQgaXQgaW5zZXJ0IGl0c2VsZiBpbnRvIGEgbmV3IGxpbmUsIG9yIHNob3VsZCB0aGUgdGV4dCBiZVxuICAgICAqIGluc2VydGVkIGF0IHRoZSBjdXJzb3IgcG9zaXRpb24uKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFJlZ2lzdGVyKHRleHQsIGxpbmV3aXNlLCBibG9ja3dpc2UpIHtcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIHRoaXMua2V5QnVmZmVyID0gW3RleHQgfHwgJyddO1xuICAgICAgdGhpcy5pbnNlcnRNb2RlQ2hhbmdlcyA9IFtdO1xuICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW107XG4gICAgICB0aGlzLmxpbmV3aXNlID0gISFsaW5ld2lzZTtcbiAgICAgIHRoaXMuYmxvY2t3aXNlID0gISFibG9ja3dpc2U7XG4gICAgfVxuICAgIFJlZ2lzdGVyLnByb3RvdHlwZSA9IHtcbiAgICAgIHNldFRleHQ6IGZ1bmN0aW9uKHRleHQsIGxpbmV3aXNlLCBibG9ja3dpc2UpIHtcbiAgICAgICAgdGhpcy5rZXlCdWZmZXIgPSBbdGV4dCB8fCAnJ107XG4gICAgICAgIHRoaXMubGluZXdpc2UgPSAhIWxpbmV3aXNlO1xuICAgICAgICB0aGlzLmJsb2Nrd2lzZSA9ICEhYmxvY2t3aXNlO1xuICAgICAgfSxcbiAgICAgIHB1c2hUZXh0OiBmdW5jdGlvbih0ZXh0LCBsaW5ld2lzZSkge1xuICAgICAgICAvLyBpZiB0aGlzIHJlZ2lzdGVyIGhhcyBldmVyIGJlZW4gc2V0IHRvIGxpbmV3aXNlLCB1c2UgbGluZXdpc2UuXG4gICAgICAgIGlmIChsaW5ld2lzZSkge1xuICAgICAgICAgIGlmICghdGhpcy5saW5ld2lzZSkge1xuICAgICAgICAgICAgdGhpcy5rZXlCdWZmZXIucHVzaCgnXFxuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubGluZXdpc2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua2V5QnVmZmVyLnB1c2godGV4dCk7XG4gICAgICB9LFxuICAgICAgcHVzaEluc2VydE1vZGVDaGFuZ2VzOiBmdW5jdGlvbihjaGFuZ2VzKSB7XG4gICAgICAgIHRoaXMuaW5zZXJ0TW9kZUNoYW5nZXMucHVzaChjcmVhdGVJbnNlcnRNb2RlQ2hhbmdlcyhjaGFuZ2VzKSk7XG4gICAgICB9LFxuICAgICAgcHVzaFNlYXJjaFF1ZXJ5OiBmdW5jdGlvbihxdWVyeSkge1xuICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMucHVzaChxdWVyeSk7XG4gICAgICB9LFxuICAgICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmtleUJ1ZmZlciA9IFtdO1xuICAgICAgICB0aGlzLmluc2VydE1vZGVDaGFuZ2VzID0gW107XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdO1xuICAgICAgICB0aGlzLmxpbmV3aXNlID0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5rZXlCdWZmZXIuam9pbignJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYW4gZXh0ZXJuYWwgcmVnaXN0ZXIuXG4gICAgICpcbiAgICAgKiBUaGUgbmFtZSBzaG91bGQgYmUgYSBzaW5nbGUgY2hhcmFjdGVyIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlZmVyZW5jZSB0aGUgcmVnaXN0ZXIuXG4gICAgICogVGhlIHJlZ2lzdGVyIHNob3VsZCBzdXBwb3J0IHNldFRleHQsIHB1c2hUZXh0LCBjbGVhciwgYW5kIHRvU3RyaW5nKCkuIFNlZSBSZWdpc3RlclxuICAgICAqIGZvciBhIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWZpbmVSZWdpc3RlcihuYW1lLCByZWdpc3Rlcikge1xuICAgICAgdmFyIHJlZ2lzdGVycyA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5yZWdpc3RlcnM7XG4gICAgICBpZiAoIW5hbWUgfHwgbmFtZS5sZW5ndGggIT0gMSkge1xuICAgICAgICB0aHJvdyBFcnJvcignUmVnaXN0ZXIgbmFtZSBtdXN0IGJlIDEgY2hhcmFjdGVyJyk7XG4gICAgICB9XG4gICAgICBpZiAocmVnaXN0ZXJzW25hbWVdKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdSZWdpc3RlciBhbHJlYWR5IGRlZmluZWQgJyArIG5hbWUpO1xuICAgICAgfVxuICAgICAgcmVnaXN0ZXJzW25hbWVdID0gcmVnaXN0ZXI7XG4gICAgICB2YWxpZFJlZ2lzdGVycy5wdXNoKG5hbWUpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogdmltIHJlZ2lzdGVycyBhbGxvdyB5b3UgdG8ga2VlcCBtYW55IGluZGVwZW5kZW50IGNvcHkgYW5kIHBhc3RlIGJ1ZmZlcnMuXG4gICAgICogU2VlIGh0dHA6Ly91c2V2aW0uY29tLzIwMTIvMDQvMTMvcmVnaXN0ZXJzLyBmb3IgYW4gaW50cm9kdWN0aW9uLlxuICAgICAqXG4gICAgICogUmVnaXN0ZXJDb250cm9sbGVyIGtlZXBzIHRoZSBzdGF0ZSBvZiBhbGwgdGhlIHJlZ2lzdGVycy4gIEFuIGluaXRpYWxcbiAgICAgKiBzdGF0ZSBtYXkgYmUgcGFzc2VkIGluLiAgVGhlIHVubmFtZWQgcmVnaXN0ZXIgJ1wiJyB3aWxsIGFsd2F5cyBiZVxuICAgICAqIG92ZXJyaWRkZW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gUmVnaXN0ZXJDb250cm9sbGVyKHJlZ2lzdGVycykge1xuICAgICAgdGhpcy5yZWdpc3RlcnMgPSByZWdpc3RlcnM7XG4gICAgICB0aGlzLnVubmFtZWRSZWdpc3RlciA9IHJlZ2lzdGVyc1snXCInXSA9IG5ldyBSZWdpc3RlcigpO1xuICAgICAgcmVnaXN0ZXJzWycuJ10gPSBuZXcgUmVnaXN0ZXIoKTtcbiAgICAgIHJlZ2lzdGVyc1snOiddID0gbmV3IFJlZ2lzdGVyKCk7XG4gICAgICByZWdpc3RlcnNbJy8nXSA9IG5ldyBSZWdpc3RlcigpO1xuICAgIH1cbiAgICBSZWdpc3RlckNvbnRyb2xsZXIucHJvdG90eXBlID0ge1xuICAgICAgcHVzaFRleHQ6IGZ1bmN0aW9uKHJlZ2lzdGVyTmFtZSwgb3BlcmF0b3IsIHRleHQsIGxpbmV3aXNlLCBibG9ja3dpc2UpIHtcbiAgICAgICAgaWYgKGxpbmV3aXNlICYmIHRleHQuY2hhckF0KHRleHQubGVuZ3RoIC0gMSkgIT09ICdcXG4nKXtcbiAgICAgICAgICB0ZXh0ICs9ICdcXG4nO1xuICAgICAgICB9XG4gICAgICAgIC8vIExvd2VyY2FzZSBhbmQgdXBwZXJjYXNlIHJlZ2lzdGVycyByZWZlciB0byB0aGUgc2FtZSByZWdpc3Rlci5cbiAgICAgICAgLy8gVXBwZXJjYXNlIGp1c3QgbWVhbnMgYXBwZW5kLlxuICAgICAgICB2YXIgcmVnaXN0ZXIgPSB0aGlzLmlzVmFsaWRSZWdpc3RlcihyZWdpc3Rlck5hbWUpID9cbiAgICAgICAgICAgIHRoaXMuZ2V0UmVnaXN0ZXIocmVnaXN0ZXJOYW1lKSA6IG51bGw7XG4gICAgICAgIC8vIGlmIG5vIHJlZ2lzdGVyL2FuIGludmFsaWQgcmVnaXN0ZXIgd2FzIHNwZWNpZmllZCwgdGhpbmdzIGdvIHRvIHRoZVxuICAgICAgICAvLyBkZWZhdWx0IHJlZ2lzdGVyc1xuICAgICAgICBpZiAoIXJlZ2lzdGVyKSB7XG4gICAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgY2FzZSAneWFuayc6XG4gICAgICAgICAgICAgIC8vIFRoZSAwIHJlZ2lzdGVyIGNvbnRhaW5zIHRoZSB0ZXh0IGZyb20gdGhlIG1vc3QgcmVjZW50IHlhbmsuXG4gICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJzWycwJ10gPSBuZXcgUmVnaXN0ZXIodGV4dCwgbGluZXdpc2UsIGJsb2Nrd2lzZSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgIGNhc2UgJ2NoYW5nZSc6XG4gICAgICAgICAgICAgIGlmICh0ZXh0LmluZGV4T2YoJ1xcbicpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIGxlc3MgdGhhbiAxIGxpbmUuIFVwZGF0ZSB0aGUgc21hbGwgZGVsZXRlIHJlZ2lzdGVyLlxuICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJzWyctJ10gPSBuZXcgUmVnaXN0ZXIodGV4dCwgbGluZXdpc2UpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNoaWZ0IGRvd24gdGhlIGNvbnRlbnRzIG9mIHRoZSBudW1iZXJlZCByZWdpc3RlcnMgYW5kIHB1dCB0aGVcbiAgICAgICAgICAgICAgICAvLyBkZWxldGVkIHRleHQgaW50byByZWdpc3RlciAxLlxuICAgICAgICAgICAgICAgIHRoaXMuc2hpZnROdW1lcmljUmVnaXN0ZXJzXygpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJzWycxJ10gPSBuZXcgUmVnaXN0ZXIodGV4dCwgbGluZXdpc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHVubmFtZWQgcmVnaXN0ZXIgaXMgc2V0IHRvIHdoYXQganVzdCBoYXBwZW5lZFxuICAgICAgICAgIHRoaXMudW5uYW1lZFJlZ2lzdGVyLnNldFRleHQodGV4dCwgbGluZXdpc2UsIGJsb2Nrd2lzZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UndmUgZ290dGVuIHRvIHRoaXMgcG9pbnQsIHdlJ3ZlIGFjdHVhbGx5IHNwZWNpZmllZCBhIHJlZ2lzdGVyXG4gICAgICAgIHZhciBhcHBlbmQgPSBpc1VwcGVyQ2FzZShyZWdpc3Rlck5hbWUpO1xuICAgICAgICBpZiAoYXBwZW5kKSB7XG4gICAgICAgICAgcmVnaXN0ZXIucHVzaFRleHQodGV4dCwgbGluZXdpc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZ2lzdGVyLnNldFRleHQodGV4dCwgbGluZXdpc2UsIGJsb2Nrd2lzZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIHVubmFtZWQgcmVnaXN0ZXIgYWx3YXlzIGhhcyB0aGUgc2FtZSB2YWx1ZSBhcyB0aGUgbGFzdCB1c2VkXG4gICAgICAgIC8vIHJlZ2lzdGVyLlxuICAgICAgICB0aGlzLnVubmFtZWRSZWdpc3Rlci5zZXRUZXh0KHJlZ2lzdGVyLnRvU3RyaW5nKCksIGxpbmV3aXNlKTtcbiAgICAgIH0sXG4gICAgICAvLyBHZXRzIHRoZSByZWdpc3RlciBuYW1lZCBAbmFtZS4gIElmIG9uZSBvZiBAbmFtZSBkb2Vzbid0IGFscmVhZHkgZXhpc3QsXG4gICAgICAvLyBjcmVhdGUgaXQuICBJZiBAbmFtZSBpcyBpbnZhbGlkLCByZXR1cm4gdGhlIHVubmFtZWRSZWdpc3Rlci5cbiAgICAgIGdldFJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkUmVnaXN0ZXIobmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy51bm5hbWVkUmVnaXN0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKCF0aGlzLnJlZ2lzdGVyc1tuYW1lXSkge1xuICAgICAgICAgIHRoaXMucmVnaXN0ZXJzW25hbWVdID0gbmV3IFJlZ2lzdGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJzW25hbWVdO1xuICAgICAgfSxcbiAgICAgIGlzVmFsaWRSZWdpc3RlcjogZnVuY3Rpb24obmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSAmJiBpbkFycmF5KG5hbWUsIHZhbGlkUmVnaXN0ZXJzKTtcbiAgICAgIH0sXG4gICAgICBzaGlmdE51bWVyaWNSZWdpc3RlcnNfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDk7IGkgPj0gMjsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5yZWdpc3RlcnNbaV0gPSB0aGlzLmdldFJlZ2lzdGVyKCcnICsgKGkgLSAxKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIEhpc3RvcnlDb250cm9sbGVyKCkge1xuICAgICAgICB0aGlzLmhpc3RvcnlCdWZmZXIgPSBbXTtcbiAgICAgICAgdGhpcy5pdGVyYXRvciA9IDA7XG4gICAgICAgIHRoaXMuaW5pdGlhbFByZWZpeCA9IG51bGw7XG4gICAgfVxuICAgIEhpc3RvcnlDb250cm9sbGVyLnByb3RvdHlwZSA9IHtcbiAgICAgIC8vIHRoZSBpbnB1dCBhcmd1bWVudCBoZXJlIGFjdHMgYSB1c2VyIGVudGVyZWQgcHJlZml4IGZvciBhIHNtYWxsIHRpbWVcbiAgICAgIC8vIHVudGlsIHdlIHN0YXJ0IGF1dG9jb21wbGV0aW9uIGluIHdoaWNoIGNhc2UgaXQgaXMgdGhlIGF1dG9jb21wbGV0ZWQuXG4gICAgICBuZXh0TWF0Y2g6IGZ1bmN0aW9uIChpbnB1dCwgdXApIHtcbiAgICAgICAgdmFyIGhpc3RvcnlCdWZmZXIgPSB0aGlzLmhpc3RvcnlCdWZmZXI7XG4gICAgICAgIHZhciBkaXIgPSB1cCA/IC0xIDogMTtcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFByZWZpeCA9PT0gbnVsbCkgdGhpcy5pbml0aWFsUHJlZml4ID0gaW5wdXQ7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLml0ZXJhdG9yICsgZGlyOyB1cCA/IGkgPj0gMCA6IGkgPCBoaXN0b3J5QnVmZmVyLmxlbmd0aDsgaSs9IGRpcikge1xuICAgICAgICAgIHZhciBlbGVtZW50ID0gaGlzdG9yeUJ1ZmZlcltpXTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8PSBlbGVtZW50Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbml0aWFsUHJlZml4ID09IGVsZW1lbnQuc3Vic3RyaW5nKDAsIGopKSB7XG4gICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IgPSBpO1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2hvdWxkIHJldHVybiB0aGUgdXNlciBpbnB1dCBpbiBjYXNlIHdlIHJlYWNoIHRoZSBlbmQgb2YgYnVmZmVyLlxuICAgICAgICBpZiAoaSA+PSBoaXN0b3J5QnVmZmVyLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuaXRlcmF0b3IgPSBoaXN0b3J5QnVmZmVyLmxlbmd0aDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbml0aWFsUHJlZml4O1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiB0aGUgbGFzdCBhdXRvY29tcGxldGVkIHF1ZXJ5IG9yIGV4Q29tbWFuZCBhcyBpdCBpcy5cbiAgICAgICAgaWYgKGkgPCAwICkgcmV0dXJuIGlucHV0O1xuICAgICAgfSxcbiAgICAgIHB1c2hJbnB1dDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5oaXN0b3J5QnVmZmVyLmluZGV4T2YoaW5wdXQpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkgdGhpcy5oaXN0b3J5QnVmZmVyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGlmIChpbnB1dC5sZW5ndGgpIHRoaXMuaGlzdG9yeUJ1ZmZlci5wdXNoKGlucHV0KTtcbiAgICAgIH0sXG4gICAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFByZWZpeCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXRlcmF0b3IgPSB0aGlzLmhpc3RvcnlCdWZmZXIubGVuZ3RoO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGNvbW1hbmREaXNwYXRjaGVyID0ge1xuICAgICAgbWF0Y2hDb21tYW5kOiBmdW5jdGlvbihrZXlzLCBrZXlNYXAsIGlucHV0U3RhdGUsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBjb21tYW5kTWF0Y2hlcyhrZXlzLCBrZXlNYXAsIGNvbnRleHQsIGlucHV0U3RhdGUpO1xuICAgICAgICBpZiAoIW1hdGNoZXMuZnVsbCAmJiAhbWF0Y2hlcy5wYXJ0aWFsKSB7XG4gICAgICAgICAgcmV0dXJuIHt0eXBlOiAnbm9uZSd9O1xuICAgICAgICB9IGVsc2UgaWYgKCFtYXRjaGVzLmZ1bGwgJiYgbWF0Y2hlcy5wYXJ0aWFsKSB7XG4gICAgICAgICAgcmV0dXJuIHt0eXBlOiAncGFydGlhbCd9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGJlc3RNYXRjaDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXRjaGVzLmZ1bGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBtYXRjaGVzLmZ1bGxbaV07XG4gICAgICAgICAgaWYgKCFiZXN0TWF0Y2gpIHtcbiAgICAgICAgICAgIGJlc3RNYXRjaCA9IG1hdGNoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYmVzdE1hdGNoLmtleXMuc2xpY2UoLTExKSA9PSAnPGNoYXJhY3Rlcj4nKSB7XG4gICAgICAgICAgdmFyIGNoYXJhY3RlciA9IGxhc3RDaGFyKGtleXMpO1xuICAgICAgICAgIGlmICghY2hhcmFjdGVyKSByZXR1cm4ge3R5cGU6ICdub25lJ307XG4gICAgICAgICAgaW5wdXRTdGF0ZS5zZWxlY3RlZENoYXJhY3RlciA9IGNoYXJhY3RlcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3R5cGU6ICdmdWxsJywgY29tbWFuZDogYmVzdE1hdGNofTtcbiAgICAgIH0sXG4gICAgICBwcm9jZXNzQ29tbWFuZDogZnVuY3Rpb24oY20sIHZpbSwgY29tbWFuZCkge1xuICAgICAgICB2aW0uaW5wdXRTdGF0ZS5yZXBlYXRPdmVycmlkZSA9IGNvbW1hbmQucmVwZWF0T3ZlcnJpZGU7XG4gICAgICAgIHN3aXRjaCAoY29tbWFuZC50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnbW90aW9uJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc01vdGlvbihjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ29wZXJhdG9yJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc09wZXJhdG9yKGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnb3BlcmF0b3JNb3Rpb24nOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzT3BlcmF0b3JNb3Rpb24oY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhY3Rpb24nOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzQWN0aW9uKGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc2VhcmNoJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1NlYXJjaChjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2V4JzpcbiAgICAgICAgICBjYXNlICdrZXlUb0V4JzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0V4KGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvY2Vzc01vdGlvbjogZnVuY3Rpb24oY20sIHZpbSwgY29tbWFuZCkge1xuICAgICAgICB2aW0uaW5wdXRTdGF0ZS5tb3Rpb24gPSBjb21tYW5kLm1vdGlvbjtcbiAgICAgICAgdmltLmlucHV0U3RhdGUubW90aW9uQXJncyA9IGNvcHlBcmdzKGNvbW1hbmQubW90aW9uQXJncyk7XG4gICAgICAgIHRoaXMuZXZhbElucHV0KGNtLCB2aW0pO1xuICAgICAgfSxcbiAgICAgIHByb2Nlc3NPcGVyYXRvcjogZnVuY3Rpb24oY20sIHZpbSwgY29tbWFuZCkge1xuICAgICAgICB2YXIgaW5wdXRTdGF0ZSA9IHZpbS5pbnB1dFN0YXRlO1xuICAgICAgICBpZiAoaW5wdXRTdGF0ZS5vcGVyYXRvcikge1xuICAgICAgICAgIGlmIChpbnB1dFN0YXRlLm9wZXJhdG9yID09IGNvbW1hbmQub3BlcmF0b3IpIHtcbiAgICAgICAgICAgIC8vIFR5cGluZyBhbiBvcGVyYXRvciB0d2ljZSBsaWtlICdkZCcgbWFrZXMgdGhlIG9wZXJhdG9yIG9wZXJhdGVcbiAgICAgICAgICAgIC8vIGxpbmV3aXNlXG4gICAgICAgICAgICBpbnB1dFN0YXRlLm1vdGlvbiA9ICdleHBhbmRUb0xpbmUnO1xuICAgICAgICAgICAgaW5wdXRTdGF0ZS5tb3Rpb25BcmdzID0geyBsaW5ld2lzZTogdHJ1ZSB9O1xuICAgICAgICAgICAgdGhpcy5ldmFsSW5wdXQoY20sIHZpbSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIDIgZGlmZmVyZW50IG9wZXJhdG9ycyBpbiBhIHJvdyBkb2Vzbid0IG1ha2Ugc2Vuc2UuXG4gICAgICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpbnB1dFN0YXRlLm9wZXJhdG9yID0gY29tbWFuZC5vcGVyYXRvcjtcbiAgICAgICAgaW5wdXRTdGF0ZS5vcGVyYXRvckFyZ3MgPSBjb3B5QXJncyhjb21tYW5kLm9wZXJhdG9yQXJncyk7XG4gICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIC8vIE9wZXJhdGluZyBvbiBhIHNlbGVjdGlvbiBpbiB2aXN1YWwgbW9kZS4gV2UgZG9uJ3QgbmVlZCBhIG1vdGlvbi5cbiAgICAgICAgICB0aGlzLmV2YWxJbnB1dChjbSwgdmltKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb2Nlc3NPcGVyYXRvck1vdGlvbjogZnVuY3Rpb24oY20sIHZpbSwgY29tbWFuZCkge1xuICAgICAgICB2YXIgdmlzdWFsTW9kZSA9IHZpbS52aXN1YWxNb2RlO1xuICAgICAgICB2YXIgb3BlcmF0b3JNb3Rpb25BcmdzID0gY29weUFyZ3MoY29tbWFuZC5vcGVyYXRvck1vdGlvbkFyZ3MpO1xuICAgICAgICBpZiAob3BlcmF0b3JNb3Rpb25BcmdzKSB7XG4gICAgICAgICAgLy8gT3BlcmF0b3IgbW90aW9ucyBtYXkgaGF2ZSBzcGVjaWFsIGJlaGF2aW9yIGluIHZpc3VhbCBtb2RlLlxuICAgICAgICAgIGlmICh2aXN1YWxNb2RlICYmIG9wZXJhdG9yTW90aW9uQXJncy52aXN1YWxMaW5lKSB7XG4gICAgICAgICAgICB2aW0udmlzdWFsTGluZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvY2Vzc09wZXJhdG9yKGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICBpZiAoIXZpc3VhbE1vZGUpIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NNb3Rpb24oY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9jZXNzQWN0aW9uOiBmdW5jdGlvbihjbSwgdmltLCBjb21tYW5kKSB7XG4gICAgICAgIHZhciBpbnB1dFN0YXRlID0gdmltLmlucHV0U3RhdGU7XG4gICAgICAgIHZhciByZXBlYXQgPSBpbnB1dFN0YXRlLmdldFJlcGVhdCgpO1xuICAgICAgICB2YXIgcmVwZWF0SXNFeHBsaWNpdCA9ICEhcmVwZWF0O1xuICAgICAgICB2YXIgYWN0aW9uQXJncyA9IGNvcHlBcmdzKGNvbW1hbmQuYWN0aW9uQXJncykgfHwge307XG4gICAgICAgIGlmIChpbnB1dFN0YXRlLnNlbGVjdGVkQ2hhcmFjdGVyKSB7XG4gICAgICAgICAgYWN0aW9uQXJncy5zZWxlY3RlZENoYXJhY3RlciA9IGlucHV0U3RhdGUuc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWN0aW9ucyBtYXkgb3IgbWF5IG5vdCBoYXZlIG1vdGlvbnMgYW5kIG9wZXJhdG9ycy4gRG8gdGhlc2UgZmlyc3QuXG4gICAgICAgIGlmIChjb21tYW5kLm9wZXJhdG9yKSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzT3BlcmF0b3IoY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbW1hbmQubW90aW9uKSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzTW90aW9uKGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb21tYW5kLm1vdGlvbiB8fCBjb21tYW5kLm9wZXJhdG9yKSB7XG4gICAgICAgICAgdGhpcy5ldmFsSW5wdXQoY20sIHZpbSk7XG4gICAgICAgIH1cbiAgICAgICAgYWN0aW9uQXJncy5yZXBlYXQgPSByZXBlYXQgfHwgMTtcbiAgICAgICAgYWN0aW9uQXJncy5yZXBlYXRJc0V4cGxpY2l0ID0gcmVwZWF0SXNFeHBsaWNpdDtcbiAgICAgICAgYWN0aW9uQXJncy5yZWdpc3Rlck5hbWUgPSBpbnB1dFN0YXRlLnJlZ2lzdGVyTmFtZTtcbiAgICAgICAgY2xlYXJJbnB1dFN0YXRlKGNtKTtcbiAgICAgICAgdmltLmxhc3RNb3Rpb24gPSBudWxsO1xuICAgICAgICBpZiAoY29tbWFuZC5pc0VkaXQpIHtcbiAgICAgICAgICB0aGlzLnJlY29yZExhc3RFZGl0KHZpbSwgaW5wdXRTdGF0ZSwgY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgYWN0aW9uc1tjb21tYW5kLmFjdGlvbl0oY20sIGFjdGlvbkFyZ3MsIHZpbSk7XG4gICAgICB9LFxuICAgICAgcHJvY2Vzc1NlYXJjaDogZnVuY3Rpb24oY20sIHZpbSwgY29tbWFuZCkge1xuICAgICAgICBpZiAoIWNtLmdldFNlYXJjaEN1cnNvcikge1xuICAgICAgICAgIC8vIFNlYXJjaCBkZXBlbmRzIG9uIFNlYXJjaEN1cnNvci5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZvcndhcmQgPSBjb21tYW5kLnNlYXJjaEFyZ3MuZm9yd2FyZDtcbiAgICAgICAgdmFyIHdob2xlV29yZE9ubHkgPSBjb21tYW5kLnNlYXJjaEFyZ3Mud2hvbGVXb3JkT25seTtcbiAgICAgICAgZ2V0U2VhcmNoU3RhdGUoY20pLnNldFJldmVyc2VkKCFmb3J3YXJkKTtcbiAgICAgICAgdmFyIHByb21wdFByZWZpeCA9IChmb3J3YXJkKSA/ICcvJyA6ICc/JztcbiAgICAgICAgdmFyIG9yaWdpbmFsUXVlcnkgPSBnZXRTZWFyY2hTdGF0ZShjbSkuZ2V0UXVlcnkoKTtcbiAgICAgICAgdmFyIG9yaWdpbmFsU2Nyb2xsUG9zID0gY20uZ2V0U2Nyb2xsSW5mbygpO1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVRdWVyeShxdWVyeSwgaWdub3JlQ2FzZSwgc21hcnRDYXNlKSB7XG4gICAgICAgICAgdmltR2xvYmFsU3RhdGUuc2VhcmNoSGlzdG9yeUNvbnRyb2xsZXIucHVzaElucHV0KHF1ZXJ5KTtcbiAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5zZWFyY2hIaXN0b3J5Q29udHJvbGxlci5yZXNldCgpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB1cGRhdGVTZWFyY2hRdWVyeShjbSwgcXVlcnksIGlnbm9yZUNhc2UsIHNtYXJ0Q2FzZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdJbnZhbGlkIHJlZ2V4OiAnICsgcXVlcnkpO1xuICAgICAgICAgICAgY2xlYXJJbnB1dFN0YXRlKGNtKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc01vdGlvbihjbSwgdmltLCB7XG4gICAgICAgICAgICB0eXBlOiAnbW90aW9uJyxcbiAgICAgICAgICAgIG1vdGlvbjogJ2ZpbmROZXh0JyxcbiAgICAgICAgICAgIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgdG9KdW1wbGlzdDogY29tbWFuZC5zZWFyY2hBcmdzLnRvSnVtcGxpc3QgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9uUHJvbXB0Q2xvc2UocXVlcnkpIHtcbiAgICAgICAgICBjbS5zY3JvbGxUbyhvcmlnaW5hbFNjcm9sbFBvcy5sZWZ0LCBvcmlnaW5hbFNjcm9sbFBvcy50b3ApO1xuICAgICAgICAgIGhhbmRsZVF1ZXJ5KHF1ZXJ5LCB0cnVlIC8qKiBpZ25vcmVDYXNlICovLCB0cnVlIC8qKiBzbWFydENhc2UgKi8pO1xuICAgICAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgICAgIGlmIChtYWNyb01vZGVTdGF0ZS5pc1JlY29yZGluZykge1xuICAgICAgICAgICAgbG9nU2VhcmNoUXVlcnkobWFjcm9Nb2RlU3RhdGUsIHF1ZXJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb25Qcm9tcHRLZXlVcChlLCBxdWVyeSwgY2xvc2UpIHtcbiAgICAgICAgICB2YXIga2V5TmFtZSA9IENvZGVNaXJyb3Iua2V5TmFtZShlKSwgdXAsIG9mZnNldDtcbiAgICAgICAgICBpZiAoa2V5TmFtZSA9PSAnVXAnIHx8IGtleU5hbWUgPT0gJ0Rvd24nKSB7XG4gICAgICAgICAgICB1cCA9IGtleU5hbWUgPT0gJ1VwJyA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIG9mZnNldCA9IGUudGFyZ2V0ID8gZS50YXJnZXQuc2VsZWN0aW9uRW5kIDogMDtcbiAgICAgICAgICAgIHF1ZXJ5ID0gdmltR2xvYmFsU3RhdGUuc2VhcmNoSGlzdG9yeUNvbnRyb2xsZXIubmV4dE1hdGNoKHF1ZXJ5LCB1cCkgfHwgJyc7XG4gICAgICAgICAgICBjbG9zZShxdWVyeSk7XG4gICAgICAgICAgICBpZiAob2Zmc2V0ICYmIGUudGFyZ2V0KSBlLnRhcmdldC5zZWxlY3Rpb25FbmQgPSBlLnRhcmdldC5zZWxlY3Rpb25TdGFydCA9IE1hdGgubWluKG9mZnNldCwgZS50YXJnZXQudmFsdWUubGVuZ3RoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCBrZXlOYW1lICE9ICdMZWZ0JyAmJiBrZXlOYW1lICE9ICdSaWdodCcgJiYga2V5TmFtZSAhPSAnQ3RybCcgJiYga2V5TmFtZSAhPSAnQWx0JyAmJiBrZXlOYW1lICE9ICdTaGlmdCcpXG4gICAgICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLnNlYXJjaEhpc3RvcnlDb250cm9sbGVyLnJlc2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBwYXJzZWRRdWVyeTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGFyc2VkUXVlcnkgPSB1cGRhdGVTZWFyY2hRdWVyeShjbSwgcXVlcnksXG4gICAgICAgICAgICAgICAgdHJ1ZSAvKiogaWdub3JlQ2FzZSAqLywgdHJ1ZSAvKiogc21hcnRDYXNlICovKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBTd2FsbG93IGJhZCByZWdleGVzIGZvciBpbmNyZW1lbnRhbCBzZWFyY2guXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwYXJzZWRRdWVyeSkge1xuICAgICAgICAgICAgY20uc2Nyb2xsSW50b1ZpZXcoZmluZE5leHQoY20sICFmb3J3YXJkLCBwYXJzZWRRdWVyeSksIDMwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xlYXJTZWFyY2hIaWdobGlnaHQoY20pO1xuICAgICAgICAgICAgY20uc2Nyb2xsVG8ob3JpZ2luYWxTY3JvbGxQb3MubGVmdCwgb3JpZ2luYWxTY3JvbGxQb3MudG9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb25Qcm9tcHRLZXlEb3duKGUsIHF1ZXJ5LCBjbG9zZSkge1xuICAgICAgICAgIHZhciBrZXlOYW1lID0gQ29kZU1pcnJvci5rZXlOYW1lKGUpO1xuICAgICAgICAgIGlmIChrZXlOYW1lID09ICdFc2MnIHx8IGtleU5hbWUgPT0gJ0N0cmwtQycgfHwga2V5TmFtZSA9PSAnQ3RybC1bJyB8fFxuICAgICAgICAgICAgICAoa2V5TmFtZSA9PSAnQmFja3NwYWNlJyAmJiBxdWVyeSA9PSAnJykpIHtcbiAgICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLnNlYXJjaEhpc3RvcnlDb250cm9sbGVyLnB1c2hJbnB1dChxdWVyeSk7XG4gICAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5zZWFyY2hIaXN0b3J5Q29udHJvbGxlci5yZXNldCgpO1xuICAgICAgICAgICAgdXBkYXRlU2VhcmNoUXVlcnkoY20sIG9yaWdpbmFsUXVlcnkpO1xuICAgICAgICAgICAgY2xlYXJTZWFyY2hIaWdobGlnaHQoY20pO1xuICAgICAgICAgICAgY20uc2Nyb2xsVG8ob3JpZ2luYWxTY3JvbGxQb3MubGVmdCwgb3JpZ2luYWxTY3JvbGxQb3MudG9wKTtcbiAgICAgICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICAgICAgY2xlYXJJbnB1dFN0YXRlKGNtKTtcbiAgICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgICAgICBjbS5mb2N1cygpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5TmFtZSA9PSAnVXAnIHx8IGtleU5hbWUgPT0gJ0Rvd24nKSB7XG4gICAgICAgICAgICBDb2RlTWlycm9yLmVfc3RvcChlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGtleU5hbWUgPT0gJ0N0cmwtVScpIHtcbiAgICAgICAgICAgIC8vIEN0cmwtVSBjbGVhcnMgaW5wdXQuXG4gICAgICAgICAgICBDb2RlTWlycm9yLmVfc3RvcChlKTtcbiAgICAgICAgICAgIGNsb3NlKCcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChjb21tYW5kLnNlYXJjaEFyZ3MucXVlcnlTcmMpIHtcbiAgICAgICAgICBjYXNlICdwcm9tcHQnOlxuICAgICAgICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICAgICAgICBpZiAobWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAgIHZhciBxdWVyeSA9IG1hY3JvTW9kZVN0YXRlLnJlcGxheVNlYXJjaFF1ZXJpZXMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgaGFuZGxlUXVlcnkocXVlcnksIHRydWUgLyoqIGlnbm9yZUNhc2UgKi8sIGZhbHNlIC8qKiBzbWFydENhc2UgKi8pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2hvd1Byb21wdChjbSwge1xuICAgICAgICAgICAgICAgICAgb25DbG9zZTogb25Qcm9tcHRDbG9zZSxcbiAgICAgICAgICAgICAgICAgIHByZWZpeDogcHJvbXB0UHJlZml4LFxuICAgICAgICAgICAgICAgICAgZGVzYzogc2VhcmNoUHJvbXB0RGVzYyxcbiAgICAgICAgICAgICAgICAgIG9uS2V5VXA6IG9uUHJvbXB0S2V5VXAsXG4gICAgICAgICAgICAgICAgICBvbktleURvd246IG9uUHJvbXB0S2V5RG93blxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3dvcmRVbmRlckN1cnNvcic6XG4gICAgICAgICAgICB2YXIgd29yZCA9IGV4cGFuZFdvcmRVbmRlckN1cnNvcihjbSwgZmFsc2UgLyoqIGluY2x1c2l2ZSAqLyxcbiAgICAgICAgICAgICAgICB0cnVlIC8qKiBmb3J3YXJkICovLCBmYWxzZSAvKiogYmlnV29yZCAqLyxcbiAgICAgICAgICAgICAgICB0cnVlIC8qKiBub1N5bWJvbCAqLyk7XG4gICAgICAgICAgICB2YXIgaXNLZXl3b3JkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICghd29yZCkge1xuICAgICAgICAgICAgICB3b3JkID0gZXhwYW5kV29yZFVuZGVyQ3Vyc29yKGNtLCBmYWxzZSAvKiogaW5jbHVzaXZlICovLFxuICAgICAgICAgICAgICAgICAgdHJ1ZSAvKiogZm9yd2FyZCAqLywgZmFsc2UgLyoqIGJpZ1dvcmQgKi8sXG4gICAgICAgICAgICAgICAgICBmYWxzZSAvKiogbm9TeW1ib2wgKi8pO1xuICAgICAgICAgICAgICBpc0tleXdvcmQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghd29yZCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBjbS5nZXRMaW5lKHdvcmQuc3RhcnQubGluZSkuc3Vic3RyaW5nKHdvcmQuc3RhcnQuY2gsXG4gICAgICAgICAgICAgICAgd29yZC5lbmQuY2gpO1xuICAgICAgICAgICAgaWYgKGlzS2V5d29yZCAmJiB3aG9sZVdvcmRPbmx5KSB7XG4gICAgICAgICAgICAgICAgcXVlcnkgPSAnXFxcXGInICsgcXVlcnkgKyAnXFxcXGInO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcXVlcnkgPSBlc2NhcGVSZWdleChxdWVyeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNhY2hlZEN1cnNvciBpcyB1c2VkIHRvIHNhdmUgdGhlIG9sZCBwb3NpdGlvbiBvZiB0aGUgY3Vyc29yXG4gICAgICAgICAgICAvLyB3aGVuICogb3IgIyBjYXVzZXMgdmltIHRvIHNlZWsgZm9yIHRoZSBuZWFyZXN0IHdvcmQgYW5kIHNoaWZ0XG4gICAgICAgICAgICAvLyB0aGUgY3Vyc29yIGJlZm9yZSBlbnRlcmluZyB0aGUgbW90aW9uLlxuICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUuanVtcExpc3QuY2FjaGVkQ3Vyc29yID0gY20uZ2V0Q3Vyc29yKCk7XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3Iod29yZC5zdGFydCk7XG5cbiAgICAgICAgICAgIGhhbmRsZVF1ZXJ5KHF1ZXJ5LCB0cnVlIC8qKiBpZ25vcmVDYXNlICovLCBmYWxzZSAvKiogc21hcnRDYXNlICovKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvY2Vzc0V4OiBmdW5jdGlvbihjbSwgdmltLCBjb21tYW5kKSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uUHJvbXB0Q2xvc2UoaW5wdXQpIHtcbiAgICAgICAgICAvLyBHaXZlIHRoZSBwcm9tcHQgc29tZSB0aW1lIHRvIGNsb3NlIHNvIHRoYXQgaWYgcHJvY2Vzc0NvbW1hbmQgc2hvd3NcbiAgICAgICAgICAvLyBhbiBlcnJvciwgdGhlIGVsZW1lbnRzIGRvbid0IG92ZXJsYXAuXG4gICAgICAgICAgdmltR2xvYmFsU3RhdGUuZXhDb21tYW5kSGlzdG9yeUNvbnRyb2xsZXIucHVzaElucHV0KGlucHV0KTtcbiAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5leENvbW1hbmRIaXN0b3J5Q29udHJvbGxlci5yZXNldCgpO1xuICAgICAgICAgIGV4Q29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc0NvbW1hbmQoY20sIGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblByb21wdEtleURvd24oZSwgaW5wdXQsIGNsb3NlKSB7XG4gICAgICAgICAgdmFyIGtleU5hbWUgPSBDb2RlTWlycm9yLmtleU5hbWUoZSksIHVwLCBvZmZzZXQ7XG4gICAgICAgICAgaWYgKGtleU5hbWUgPT0gJ0VzYycgfHwga2V5TmFtZSA9PSAnQ3RybC1DJyB8fCBrZXlOYW1lID09ICdDdHJsLVsnIHx8XG4gICAgICAgICAgICAgIChrZXlOYW1lID09ICdCYWNrc3BhY2UnICYmIGlucHV0ID09ICcnKSkge1xuICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUuZXhDb21tYW5kSGlzdG9yeUNvbnRyb2xsZXIucHVzaElucHV0KGlucHV0KTtcbiAgICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLmV4Q29tbWFuZEhpc3RvcnlDb250cm9sbGVyLnJlc2V0KCk7XG4gICAgICAgICAgICBDb2RlTWlycm9yLmVfc3RvcChlKTtcbiAgICAgICAgICAgIGNsZWFySW5wdXRTdGF0ZShjbSk7XG4gICAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICAgICAgY20uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGtleU5hbWUgPT0gJ1VwJyB8fCBrZXlOYW1lID09ICdEb3duJykge1xuICAgICAgICAgICAgQ29kZU1pcnJvci5lX3N0b3AoZSk7XG4gICAgICAgICAgICB1cCA9IGtleU5hbWUgPT0gJ1VwJyA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIG9mZnNldCA9IGUudGFyZ2V0ID8gZS50YXJnZXQuc2VsZWN0aW9uRW5kIDogMDtcbiAgICAgICAgICAgIGlucHV0ID0gdmltR2xvYmFsU3RhdGUuZXhDb21tYW5kSGlzdG9yeUNvbnRyb2xsZXIubmV4dE1hdGNoKGlucHV0LCB1cCkgfHwgJyc7XG4gICAgICAgICAgICBjbG9zZShpbnB1dCk7XG4gICAgICAgICAgICBpZiAob2Zmc2V0ICYmIGUudGFyZ2V0KSBlLnRhcmdldC5zZWxlY3Rpb25FbmQgPSBlLnRhcmdldC5zZWxlY3Rpb25TdGFydCA9IE1hdGgubWluKG9mZnNldCwgZS50YXJnZXQudmFsdWUubGVuZ3RoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGtleU5hbWUgPT0gJ0N0cmwtVScpIHtcbiAgICAgICAgICAgIC8vIEN0cmwtVSBjbGVhcnMgaW5wdXQuXG4gICAgICAgICAgICBDb2RlTWlycm9yLmVfc3RvcChlKTtcbiAgICAgICAgICAgIGNsb3NlKCcnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCBrZXlOYW1lICE9ICdMZWZ0JyAmJiBrZXlOYW1lICE9ICdSaWdodCcgJiYga2V5TmFtZSAhPSAnQ3RybCcgJiYga2V5TmFtZSAhPSAnQWx0JyAmJiBrZXlOYW1lICE9ICdTaGlmdCcpXG4gICAgICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLmV4Q29tbWFuZEhpc3RvcnlDb250cm9sbGVyLnJlc2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjb21tYW5kLnR5cGUgPT0gJ2tleVRvRXgnKSB7XG4gICAgICAgICAgLy8gSGFuZGxlIHVzZXIgZGVmaW5lZCBFeCB0byBFeCBtYXBwaW5nc1xuICAgICAgICAgIGV4Q29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc0NvbW1hbmQoY20sIGNvbW1hbmQuZXhBcmdzLmlucHV0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAgIHNob3dQcm9tcHQoY20sIHsgb25DbG9zZTogb25Qcm9tcHRDbG9zZSwgcHJlZml4OiAnOicsIHZhbHVlOiAnXFwnPCxcXCc+JyxcbiAgICAgICAgICAgICAgICBvbktleURvd246IG9uUHJvbXB0S2V5RG93biwgc2VsZWN0VmFsdWVPbk9wZW46IGZhbHNlfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNob3dQcm9tcHQoY20sIHsgb25DbG9zZTogb25Qcm9tcHRDbG9zZSwgcHJlZml4OiAnOicsXG4gICAgICAgICAgICAgICAgb25LZXlEb3duOiBvblByb21wdEtleURvd259KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBldmFsSW5wdXQ6IGZ1bmN0aW9uKGNtLCB2aW0pIHtcbiAgICAgICAgLy8gSWYgdGhlIG1vdGlvbiBjb21tYW5kIGlzIHNldCwgZXhlY3V0ZSBib3RoIHRoZSBvcGVyYXRvciBhbmQgbW90aW9uLlxuICAgICAgICAvLyBPdGhlcndpc2UgcmV0dXJuLlxuICAgICAgICB2YXIgaW5wdXRTdGF0ZSA9IHZpbS5pbnB1dFN0YXRlO1xuICAgICAgICB2YXIgbW90aW9uID0gaW5wdXRTdGF0ZS5tb3Rpb247XG4gICAgICAgIHZhciBtb3Rpb25BcmdzID0gaW5wdXRTdGF0ZS5tb3Rpb25BcmdzIHx8IHt9O1xuICAgICAgICB2YXIgb3BlcmF0b3IgPSBpbnB1dFN0YXRlLm9wZXJhdG9yO1xuICAgICAgICB2YXIgb3BlcmF0b3JBcmdzID0gaW5wdXRTdGF0ZS5vcGVyYXRvckFyZ3MgfHwge307XG4gICAgICAgIHZhciByZWdpc3Rlck5hbWUgPSBpbnB1dFN0YXRlLnJlZ2lzdGVyTmFtZTtcbiAgICAgICAgdmFyIHNlbCA9IHZpbS5zZWw7XG4gICAgICAgIC8vIFRPRE86IE1ha2Ugc3VyZSBjbSBhbmQgdmltIHNlbGVjdGlvbnMgYXJlIGlkZW50aWNhbCBvdXRzaWRlIHZpc3VhbCBtb2RlLlxuICAgICAgICB2YXIgb3JpZ0hlYWQgPSBjb3B5Q3Vyc29yKHZpbS52aXN1YWxNb2RlID8gY2xpcEN1cnNvclRvQ29udGVudChjbSwgc2VsLmhlYWQpOiBjbS5nZXRDdXJzb3IoJ2hlYWQnKSk7XG4gICAgICAgIHZhciBvcmlnQW5jaG9yID0gY29weUN1cnNvcih2aW0udmlzdWFsTW9kZSA/IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIHNlbC5hbmNob3IpIDogY20uZ2V0Q3Vyc29yKCdhbmNob3InKSk7XG4gICAgICAgIHZhciBvbGRIZWFkID0gY29weUN1cnNvcihvcmlnSGVhZCk7XG4gICAgICAgIHZhciBvbGRBbmNob3IgPSBjb3B5Q3Vyc29yKG9yaWdBbmNob3IpO1xuICAgICAgICB2YXIgbmV3SGVhZCwgbmV3QW5jaG9yO1xuICAgICAgICB2YXIgcmVwZWF0O1xuICAgICAgICBpZiAob3BlcmF0b3IpIHtcbiAgICAgICAgICB0aGlzLnJlY29yZExhc3RFZGl0KHZpbSwgaW5wdXRTdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0U3RhdGUucmVwZWF0T3ZlcnJpZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIElmIHJlcGVhdE92ZXJyaWRlIGlzIHNwZWNpZmllZCwgdGhhdCB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgdGhlXG4gICAgICAgICAgLy8gaW5wdXQgc3RhdGUncyByZXBlYXQuIFVzZWQgYnkgRXggbW9kZSBhbmQgY2FuIGJlIHVzZXIgZGVmaW5lZC5cbiAgICAgICAgICByZXBlYXQgPSBpbnB1dFN0YXRlLnJlcGVhdE92ZXJyaWRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcGVhdCA9IGlucHV0U3RhdGUuZ2V0UmVwZWF0KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcGVhdCA+IDAgJiYgbW90aW9uQXJncy5leHBsaWNpdFJlcGVhdCkge1xuICAgICAgICAgIG1vdGlvbkFyZ3MucmVwZWF0SXNFeHBsaWNpdCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAobW90aW9uQXJncy5ub1JlcGVhdCB8fFxuICAgICAgICAgICAgKCFtb3Rpb25BcmdzLmV4cGxpY2l0UmVwZWF0ICYmIHJlcGVhdCA9PT0gMCkpIHtcbiAgICAgICAgICByZXBlYXQgPSAxO1xuICAgICAgICAgIG1vdGlvbkFyZ3MucmVwZWF0SXNFeHBsaWNpdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dFN0YXRlLnNlbGVjdGVkQ2hhcmFjdGVyKSB7XG4gICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBjaGFyYWN0ZXIgaW5wdXQsIHN0aWNrIGl0IGluIGFsbCBvZiB0aGUgYXJnIGFycmF5cy5cbiAgICAgICAgICBtb3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyID0gb3BlcmF0b3JBcmdzLnNlbGVjdGVkQ2hhcmFjdGVyID1cbiAgICAgICAgICAgICAgaW5wdXRTdGF0ZS5zZWxlY3RlZENoYXJhY3RlcjtcbiAgICAgICAgfVxuICAgICAgICBtb3Rpb25BcmdzLnJlcGVhdCA9IHJlcGVhdDtcbiAgICAgICAgY2xlYXJJbnB1dFN0YXRlKGNtKTtcbiAgICAgICAgaWYgKG1vdGlvbikge1xuICAgICAgICAgIHZhciBtb3Rpb25SZXN1bHQgPSBtb3Rpb25zW21vdGlvbl0oY20sIG9yaWdIZWFkLCBtb3Rpb25BcmdzLCB2aW0pO1xuICAgICAgICAgIHZpbS5sYXN0TW90aW9uID0gbW90aW9uc1ttb3Rpb25dO1xuICAgICAgICAgIGlmICghbW90aW9uUmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtb3Rpb25BcmdzLnRvSnVtcGxpc3QpIHtcbiAgICAgICAgICAgIHZhciBqdW1wTGlzdCA9IHZpbUdsb2JhbFN0YXRlLmp1bXBMaXN0O1xuICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgbW90aW9uIGlzICMgb3IgKiwgdXNlIGNhY2hlZEN1cnNvclxuICAgICAgICAgICAgdmFyIGNhY2hlZEN1cnNvciA9IGp1bXBMaXN0LmNhY2hlZEN1cnNvcjtcbiAgICAgICAgICAgIGlmIChjYWNoZWRDdXJzb3IpIHtcbiAgICAgICAgICAgICAgcmVjb3JkSnVtcFBvc2l0aW9uKGNtLCBjYWNoZWRDdXJzb3IsIG1vdGlvblJlc3VsdCk7XG4gICAgICAgICAgICAgIGRlbGV0ZSBqdW1wTGlzdC5jYWNoZWRDdXJzb3I7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWNvcmRKdW1wUG9zaXRpb24oY20sIG9yaWdIZWFkLCBtb3Rpb25SZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobW90aW9uUmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIG5ld0FuY2hvciA9IG1vdGlvblJlc3VsdFswXTtcbiAgICAgICAgICAgIG5ld0hlYWQgPSBtb3Rpb25SZXN1bHRbMV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0hlYWQgPSBtb3Rpb25SZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFRPRE86IEhhbmRsZSBudWxsIHJldHVybnMgZnJvbSBtb3Rpb24gY29tbWFuZHMgYmV0dGVyLlxuICAgICAgICAgIGlmICghbmV3SGVhZCkge1xuICAgICAgICAgICAgbmV3SGVhZCA9IGNvcHlDdXJzb3Iob3JpZ0hlYWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAgIGlmICghKHZpbS52aXN1YWxCbG9jayAmJiBuZXdIZWFkLmNoID09PSBJbmZpbml0eSkpIHtcbiAgICAgICAgICAgICAgbmV3SGVhZCA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIG5ld0hlYWQsIHZpbS52aXN1YWxCbG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV3QW5jaG9yKSB7XG4gICAgICAgICAgICAgIG5ld0FuY2hvciA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIG5ld0FuY2hvciwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdBbmNob3IgPSBuZXdBbmNob3IgfHwgb2xkQW5jaG9yO1xuICAgICAgICAgICAgc2VsLmFuY2hvciA9IG5ld0FuY2hvcjtcbiAgICAgICAgICAgIHNlbC5oZWFkID0gbmV3SGVhZDtcbiAgICAgICAgICAgIHVwZGF0ZUNtU2VsZWN0aW9uKGNtKTtcbiAgICAgICAgICAgIHVwZGF0ZU1hcmsoY20sIHZpbSwgJzwnLFxuICAgICAgICAgICAgICAgIGN1cnNvcklzQmVmb3JlKG5ld0FuY2hvciwgbmV3SGVhZCkgPyBuZXdBbmNob3JcbiAgICAgICAgICAgICAgICAgICAgOiBuZXdIZWFkKTtcbiAgICAgICAgICAgIHVwZGF0ZU1hcmsoY20sIHZpbSwgJz4nLFxuICAgICAgICAgICAgICAgIGN1cnNvcklzQmVmb3JlKG5ld0FuY2hvciwgbmV3SGVhZCkgPyBuZXdIZWFkXG4gICAgICAgICAgICAgICAgICAgIDogbmV3QW5jaG9yKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFvcGVyYXRvcikge1xuICAgICAgICAgICAgbmV3SGVhZCA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIG5ld0hlYWQpO1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKG5ld0hlYWQubGluZSwgbmV3SGVhZC5jaCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcGVyYXRvcikge1xuICAgICAgICAgIGlmIChvcGVyYXRvckFyZ3MubGFzdFNlbCkge1xuICAgICAgICAgICAgLy8gUmVwbGF5aW5nIGEgdmlzdWFsIG1vZGUgb3BlcmF0aW9uXG4gICAgICAgICAgICBuZXdBbmNob3IgPSBvbGRBbmNob3I7XG4gICAgICAgICAgICB2YXIgbGFzdFNlbCA9IG9wZXJhdG9yQXJncy5sYXN0U2VsO1xuICAgICAgICAgICAgdmFyIGxpbmVPZmZzZXQgPSBNYXRoLmFicyhsYXN0U2VsLmhlYWQubGluZSAtIGxhc3RTZWwuYW5jaG9yLmxpbmUpO1xuICAgICAgICAgICAgdmFyIGNoT2Zmc2V0ID0gTWF0aC5hYnMobGFzdFNlbC5oZWFkLmNoIC0gbGFzdFNlbC5hbmNob3IuY2gpO1xuICAgICAgICAgICAgaWYgKGxhc3RTZWwudmlzdWFsTGluZSkge1xuICAgICAgICAgICAgICAvLyBMaW5ld2lzZSBWaXN1YWwgbW9kZTogVGhlIHNhbWUgbnVtYmVyIG9mIGxpbmVzLlxuICAgICAgICAgICAgICBuZXdIZWFkID0gUG9zKG9sZEFuY2hvci5saW5lICsgbGluZU9mZnNldCwgb2xkQW5jaG9yLmNoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdFNlbC52aXN1YWxCbG9jaykge1xuICAgICAgICAgICAgICAvLyBCbG9ja3dpc2UgVmlzdWFsIG1vZGU6IFRoZSBzYW1lIG51bWJlciBvZiBsaW5lcyBhbmQgY29sdW1ucy5cbiAgICAgICAgICAgICAgbmV3SGVhZCA9IFBvcyhvbGRBbmNob3IubGluZSArIGxpbmVPZmZzZXQsIG9sZEFuY2hvci5jaCArIGNoT2Zmc2V0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdFNlbC5oZWFkLmxpbmUgPT0gbGFzdFNlbC5hbmNob3IubGluZSkge1xuICAgICAgICAgICAgICAvLyBOb3JtYWwgVmlzdWFsIG1vZGUgd2l0aGluIG9uZSBsaW5lOiBUaGUgc2FtZSBudW1iZXIgb2YgY2hhcmFjdGVycy5cbiAgICAgICAgICAgICAgbmV3SGVhZCA9IFBvcyhvbGRBbmNob3IubGluZSwgb2xkQW5jaG9yLmNoICsgY2hPZmZzZXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gTm9ybWFsIFZpc3VhbCBtb2RlIHdpdGggc2V2ZXJhbCBsaW5lczogVGhlIHNhbWUgbnVtYmVyIG9mIGxpbmVzLCBpbiB0aGVcbiAgICAgICAgICAgICAgLy8gbGFzdCBsaW5lIHRoZSBzYW1lIG51bWJlciBvZiBjaGFyYWN0ZXJzIGFzIGluIHRoZSBsYXN0IGxpbmUgdGhlIGxhc3QgdGltZS5cbiAgICAgICAgICAgICAgbmV3SGVhZCA9IFBvcyhvbGRBbmNob3IubGluZSArIGxpbmVPZmZzZXQsIG9sZEFuY2hvci5jaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aW0udmlzdWFsTW9kZSA9IHRydWU7XG4gICAgICAgICAgICB2aW0udmlzdWFsTGluZSA9IGxhc3RTZWwudmlzdWFsTGluZTtcbiAgICAgICAgICAgIHZpbS52aXN1YWxCbG9jayA9IGxhc3RTZWwudmlzdWFsQmxvY2s7XG4gICAgICAgICAgICBzZWwgPSB2aW0uc2VsID0ge1xuICAgICAgICAgICAgICBhbmNob3I6IG5ld0FuY2hvcixcbiAgICAgICAgICAgICAgaGVhZDogbmV3SGVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHVwZGF0ZUNtU2VsZWN0aW9uKGNtKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgICBvcGVyYXRvckFyZ3MubGFzdFNlbCA9IHtcbiAgICAgICAgICAgICAgYW5jaG9yOiBjb3B5Q3Vyc29yKHNlbC5hbmNob3IpLFxuICAgICAgICAgICAgICBoZWFkOiBjb3B5Q3Vyc29yKHNlbC5oZWFkKSxcbiAgICAgICAgICAgICAgdmlzdWFsQmxvY2s6IHZpbS52aXN1YWxCbG9jayxcbiAgICAgICAgICAgICAgdmlzdWFsTGluZTogdmltLnZpc3VhbExpbmVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBjdXJTdGFydCwgY3VyRW5kLCBsaW5ld2lzZSwgbW9kZTtcbiAgICAgICAgICB2YXIgY21TZWw7XG4gICAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgICAvLyBJbml0IHZpc3VhbCBvcFxuICAgICAgICAgICAgY3VyU3RhcnQgPSBjdXJzb3JNaW4oc2VsLmhlYWQsIHNlbC5hbmNob3IpO1xuICAgICAgICAgICAgY3VyRW5kID0gY3Vyc29yTWF4KHNlbC5oZWFkLCBzZWwuYW5jaG9yKTtcbiAgICAgICAgICAgIGxpbmV3aXNlID0gdmltLnZpc3VhbExpbmUgfHwgb3BlcmF0b3JBcmdzLmxpbmV3aXNlO1xuICAgICAgICAgICAgbW9kZSA9IHZpbS52aXN1YWxCbG9jayA/ICdibG9jaycgOlxuICAgICAgICAgICAgICAgICAgIGxpbmV3aXNlID8gJ2xpbmUnIDpcbiAgICAgICAgICAgICAgICAgICAnY2hhcic7XG4gICAgICAgICAgICBjbVNlbCA9IG1ha2VDbVNlbGVjdGlvbihjbSwge1xuICAgICAgICAgICAgICBhbmNob3I6IGN1clN0YXJ0LFxuICAgICAgICAgICAgICBoZWFkOiBjdXJFbmRcbiAgICAgICAgICAgIH0sIG1vZGUpO1xuICAgICAgICAgICAgaWYgKGxpbmV3aXNlKSB7XG4gICAgICAgICAgICAgIHZhciByYW5nZXMgPSBjbVNlbC5yYW5nZXM7XG4gICAgICAgICAgICAgIGlmIChtb2RlID09ICdibG9jaycpIHtcbiAgICAgICAgICAgICAgICAvLyBMaW5ld2lzZSBvcGVyYXRvcnMgaW4gdmlzdWFsIGJsb2NrIG1vZGUgZXh0ZW5kIHRvIGVuZCBvZiBsaW5lXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIHJhbmdlc1tpXS5oZWFkLmNoID0gbGluZUxlbmd0aChjbSwgcmFuZ2VzW2ldLmhlYWQubGluZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1vZGUgPT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2VzWzBdLmhlYWQgPSBQb3MocmFuZ2VzWzBdLmhlYWQubGluZSArIDEsIDApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEluaXQgbW90aW9uIG9wXG4gICAgICAgICAgICBjdXJTdGFydCA9IGNvcHlDdXJzb3IobmV3QW5jaG9yIHx8IG9sZEFuY2hvcik7XG4gICAgICAgICAgICBjdXJFbmQgPSBjb3B5Q3Vyc29yKG5ld0hlYWQgfHwgb2xkSGVhZCk7XG4gICAgICAgICAgICBpZiAoY3Vyc29ySXNCZWZvcmUoY3VyRW5kLCBjdXJTdGFydCkpIHtcbiAgICAgICAgICAgICAgdmFyIHRtcCA9IGN1clN0YXJ0O1xuICAgICAgICAgICAgICBjdXJTdGFydCA9IGN1ckVuZDtcbiAgICAgICAgICAgICAgY3VyRW5kID0gdG1wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGluZXdpc2UgPSBtb3Rpb25BcmdzLmxpbmV3aXNlIHx8IG9wZXJhdG9yQXJncy5saW5ld2lzZTtcbiAgICAgICAgICAgIGlmIChsaW5ld2lzZSkge1xuICAgICAgICAgICAgICAvLyBFeHBhbmQgc2VsZWN0aW9uIHRvIGVudGlyZSBsaW5lLlxuICAgICAgICAgICAgICBleHBhbmRTZWxlY3Rpb25Ub0xpbmUoY20sIGN1clN0YXJ0LCBjdXJFbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtb3Rpb25BcmdzLmZvcndhcmQpIHtcbiAgICAgICAgICAgICAgLy8gQ2xpcCB0byB0cmFpbGluZyBuZXdsaW5lcyBvbmx5IGlmIHRoZSBtb3Rpb24gZ29lcyBmb3J3YXJkLlxuICAgICAgICAgICAgICBjbGlwVG9MaW5lKGNtLCBjdXJTdGFydCwgY3VyRW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1vZGUgPSAnY2hhcic7XG4gICAgICAgICAgICB2YXIgZXhjbHVzaXZlID0gIW1vdGlvbkFyZ3MuaW5jbHVzaXZlIHx8IGxpbmV3aXNlO1xuICAgICAgICAgICAgY21TZWwgPSBtYWtlQ21TZWxlY3Rpb24oY20sIHtcbiAgICAgICAgICAgICAgYW5jaG9yOiBjdXJTdGFydCxcbiAgICAgICAgICAgICAgaGVhZDogY3VyRW5kXG4gICAgICAgICAgICB9LCBtb2RlLCBleGNsdXNpdmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbS5zZXRTZWxlY3Rpb25zKGNtU2VsLnJhbmdlcywgY21TZWwucHJpbWFyeSk7XG4gICAgICAgICAgdmltLmxhc3RNb3Rpb24gPSBudWxsO1xuICAgICAgICAgIG9wZXJhdG9yQXJncy5yZXBlYXQgPSByZXBlYXQ7IC8vIEZvciBpbmRlbnQgaW4gdmlzdWFsIG1vZGUuXG4gICAgICAgICAgb3BlcmF0b3JBcmdzLnJlZ2lzdGVyTmFtZSA9IHJlZ2lzdGVyTmFtZTtcbiAgICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIGxpbmV3aXNlIGFzIGl0IGFmZmVjdHMgaG93IHBhc3RlIGFuZCBjaGFuZ2UgYmVoYXZlLlxuICAgICAgICAgIG9wZXJhdG9yQXJncy5saW5ld2lzZSA9IGxpbmV3aXNlO1xuICAgICAgICAgIHZhciBvcGVyYXRvck1vdmVUbyA9IG9wZXJhdG9yc1tvcGVyYXRvcl0oXG4gICAgICAgICAgICBjbSwgb3BlcmF0b3JBcmdzLCBjbVNlbC5yYW5nZXMsIG9sZEFuY2hvciwgbmV3SGVhZCk7XG4gICAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgICBleGl0VmlzdWFsTW9kZShjbSwgb3BlcmF0b3JNb3ZlVG8gIT0gbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvcGVyYXRvck1vdmVUbykge1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKG9wZXJhdG9yTW92ZVRvKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZWNvcmRMYXN0RWRpdDogZnVuY3Rpb24odmltLCBpbnB1dFN0YXRlLCBhY3Rpb25Db21tYW5kKSB7XG4gICAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgICBpZiAobWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nKSB7IHJldHVybjsgfVxuICAgICAgICB2aW0ubGFzdEVkaXRJbnB1dFN0YXRlID0gaW5wdXRTdGF0ZTtcbiAgICAgICAgdmltLmxhc3RFZGl0QWN0aW9uQ29tbWFuZCA9IGFjdGlvbkNvbW1hbmQ7XG4gICAgICAgIG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcy5jaGFuZ2VzID0gW107XG4gICAgICAgIG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcy5leHBlY3RDdXJzb3JBY3Rpdml0eUZvckNoYW5nZSA9IGZhbHNlO1xuICAgICAgICBtYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXMudmlzdWFsQmxvY2sgPSB2aW0udmlzdWFsQmxvY2sgPyB2aW0uc2VsLmhlYWQubGluZSAtIHZpbS5zZWwuYW5jaG9yLmxpbmUgOiAwO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiB0eXBlZGVmIHtPYmplY3R7bGluZTpudW1iZXIsY2g6bnVtYmVyfX0gQ3Vyc29yIEFuIG9iamVjdCBjb250YWluaW5nIHRoZVxuICAgICAqICAgICBwb3NpdGlvbiBvZiB0aGUgY3Vyc29yLlxuICAgICAqL1xuICAgIC8vIEFsbCBvZiB0aGUgZnVuY3Rpb25zIGJlbG93IHJldHVybiBDdXJzb3Igb2JqZWN0cy5cbiAgICB2YXIgbW90aW9ucyA9IHtcbiAgICAgIG1vdmVUb1RvcExpbmU6IGZ1bmN0aW9uKGNtLCBfaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgbGluZSA9IGdldFVzZXJWaXNpYmxlTGluZXMoY20pLnRvcCArIG1vdGlvbkFyZ3MucmVwZWF0IC0xO1xuICAgICAgICByZXR1cm4gUG9zKGxpbmUsIGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShsaW5lKSkpO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb01pZGRsZUxpbmU6IGZ1bmN0aW9uKGNtKSB7XG4gICAgICAgIHZhciByYW5nZSA9IGdldFVzZXJWaXNpYmxlTGluZXMoY20pO1xuICAgICAgICB2YXIgbGluZSA9IE1hdGguZmxvb3IoKHJhbmdlLnRvcCArIHJhbmdlLmJvdHRvbSkgKiAwLjUpO1xuICAgICAgICByZXR1cm4gUG9zKGxpbmUsIGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShsaW5lKSkpO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb0JvdHRvbUxpbmU6IGZ1bmN0aW9uKGNtLCBfaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgbGluZSA9IGdldFVzZXJWaXNpYmxlTGluZXMoY20pLmJvdHRvbSAtIG1vdGlvbkFyZ3MucmVwZWF0ICsxO1xuICAgICAgICByZXR1cm4gUG9zKGxpbmUsIGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShsaW5lKSkpO1xuICAgICAgfSxcbiAgICAgIGV4cGFuZFRvTGluZTogZnVuY3Rpb24oX2NtLCBoZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIC8vIEV4cGFuZHMgZm9yd2FyZCB0byBlbmQgb2YgbGluZSwgYW5kIHRoZW4gdG8gbmV4dCBsaW5lIGlmIHJlcGVhdCBpc1xuICAgICAgICAvLyA+MS4gRG9lcyBub3QgaGFuZGxlIGJhY2t3YXJkIG1vdGlvbiFcbiAgICAgICAgdmFyIGN1ciA9IGhlYWQ7XG4gICAgICAgIHJldHVybiBQb3MoY3VyLmxpbmUgKyBtb3Rpb25BcmdzLnJlcGVhdCAtIDEsIEluZmluaXR5KTtcbiAgICAgIH0sXG4gICAgICBmaW5kTmV4dDogZnVuY3Rpb24oY20sIF9oZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldFNlYXJjaFN0YXRlKGNtKTtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gc3RhdGUuZ2V0UXVlcnkoKTtcbiAgICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJldiA9ICFtb3Rpb25BcmdzLmZvcndhcmQ7XG4gICAgICAgIC8vIElmIHNlYXJjaCBpcyBpbml0aWF0ZWQgd2l0aCA/IGluc3RlYWQgb2YgLywgbmVnYXRlIGRpcmVjdGlvbi5cbiAgICAgICAgcHJldiA9IChzdGF0ZS5pc1JldmVyc2VkKCkpID8gIXByZXYgOiBwcmV2O1xuICAgICAgICBoaWdobGlnaHRTZWFyY2hNYXRjaGVzKGNtLCBxdWVyeSk7XG4gICAgICAgIHJldHVybiBmaW5kTmV4dChjbSwgcHJldi8qKiBwcmV2ICovLCBxdWVyeSwgbW90aW9uQXJncy5yZXBlYXQpO1xuICAgICAgfSxcbiAgICAgIGdvVG9NYXJrOiBmdW5jdGlvbihjbSwgX2hlYWQsIG1vdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2YXIgcG9zID0gZ2V0TWFya1BvcyhjbSwgdmltLCBtb3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyKTtcbiAgICAgICAgaWYgKHBvcykge1xuICAgICAgICAgIHJldHVybiBtb3Rpb25BcmdzLmxpbmV3aXNlID8geyBsaW5lOiBwb3MubGluZSwgY2g6IGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShwb3MubGluZSkpIH0gOiBwb3M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgbW92ZVRvT3RoZXJIaWdobGlnaHRlZEVuZDogZnVuY3Rpb24oY20sIF9oZWFkLCBtb3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxCbG9jayAmJiBtb3Rpb25BcmdzLnNhbWVMaW5lKSB7XG4gICAgICAgICAgdmFyIHNlbCA9IHZpbS5zZWw7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIFBvcyhzZWwuYW5jaG9yLmxpbmUsIHNlbC5oZWFkLmNoKSksXG4gICAgICAgICAgICBjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCBQb3Moc2VsLmhlYWQubGluZSwgc2VsLmFuY2hvci5jaCkpXG4gICAgICAgICAgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFt2aW0uc2VsLmhlYWQsIHZpbS5zZWwuYW5jaG9yXSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBqdW1wVG9NYXJrOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBiZXN0ID0gaGVhZDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb3Rpb25BcmdzLnJlcGVhdDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGN1cnNvciA9IGJlc3Q7XG4gICAgICAgICAgZm9yICh2YXIga2V5IGluIHZpbS5tYXJrcykge1xuICAgICAgICAgICAgaWYgKCFpc0xvd2VyQ2FzZShrZXkpKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1hcmsgPSB2aW0ubWFya3Nba2V5XS5maW5kKCk7XG4gICAgICAgICAgICB2YXIgaXNXcm9uZ0RpcmVjdGlvbiA9IChtb3Rpb25BcmdzLmZvcndhcmQpID9cbiAgICAgICAgICAgICAgY3Vyc29ySXNCZWZvcmUobWFyaywgY3Vyc29yKSA6IGN1cnNvcklzQmVmb3JlKGN1cnNvciwgbWFyayk7XG5cbiAgICAgICAgICAgIGlmIChpc1dyb25nRGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdGlvbkFyZ3MubGluZXdpc2UgJiYgKG1hcmsubGluZSA9PSBjdXJzb3IubGluZSkpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlcXVhbCA9IGN1cnNvckVxdWFsKGN1cnNvciwgYmVzdCk7XG4gICAgICAgICAgICB2YXIgYmV0d2VlbiA9IChtb3Rpb25BcmdzLmZvcndhcmQpID9cbiAgICAgICAgICAgICAgY3Vyc29ySXNCZXR3ZWVuKGN1cnNvciwgbWFyaywgYmVzdCkgOlxuICAgICAgICAgICAgICBjdXJzb3JJc0JldHdlZW4oYmVzdCwgbWFyaywgY3Vyc29yKTtcblxuICAgICAgICAgICAgaWYgKGVxdWFsIHx8IGJldHdlZW4pIHtcbiAgICAgICAgICAgICAgYmVzdCA9IG1hcms7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vdGlvbkFyZ3MubGluZXdpc2UpIHtcbiAgICAgICAgICAvLyBWaW0gcGxhY2VzIHRoZSBjdXJzb3Igb24gdGhlIGZpcnN0IG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlciBvZlxuICAgICAgICAgIC8vIHRoZSBsaW5lIGlmIHRoZXJlIGlzIG9uZSwgZWxzZSBpdCBwbGFjZXMgdGhlIGN1cnNvciBhdCB0aGUgZW5kXG4gICAgICAgICAgLy8gb2YgdGhlIGxpbmUsIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciBhIG1hcmsgd2FzIGZvdW5kLlxuICAgICAgICAgIGJlc3QgPSBQb3MoYmVzdC5saW5lLCBmaW5kRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLmdldExpbmUoYmVzdC5saW5lKSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiZXN0O1xuICAgICAgfSxcbiAgICAgIG1vdmVCeUNoYXJhY3RlcnM6IGZ1bmN0aW9uKF9jbSwgaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgY3VyID0gaGVhZDtcbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0O1xuICAgICAgICB2YXIgY2ggPSBtb3Rpb25BcmdzLmZvcndhcmQgPyBjdXIuY2ggKyByZXBlYXQgOiBjdXIuY2ggLSByZXBlYXQ7XG4gICAgICAgIHJldHVybiBQb3MoY3VyLmxpbmUsIGNoKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlQnlMaW5lczogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2YXIgY3VyID0gaGVhZDtcbiAgICAgICAgdmFyIGVuZENoID0gY3VyLmNoO1xuICAgICAgICAvLyBEZXBlbmRpbmcgd2hhdCBvdXIgbGFzdCBtb3Rpb24gd2FzLCB3ZSBtYXkgd2FudCB0byBkbyBkaWZmZXJlbnRcbiAgICAgICAgLy8gdGhpbmdzLiBJZiBvdXIgbGFzdCBtb3Rpb24gd2FzIG1vdmluZyB2ZXJ0aWNhbGx5LCB3ZSB3YW50IHRvXG4gICAgICAgIC8vIHByZXNlcnZlIHRoZSBIUG9zIGZyb20gb3VyIGxhc3QgaG9yaXpvbnRhbCBtb3ZlLiAgSWYgb3VyIGxhc3QgbW90aW9uXG4gICAgICAgIC8vIHdhcyBnb2luZyB0byB0aGUgZW5kIG9mIGEgbGluZSwgbW92aW5nIHZlcnRpY2FsbHkgd2Ugc2hvdWxkIGdvIHRvXG4gICAgICAgIC8vIHRoZSBlbmQgb2YgdGhlIGxpbmUsIGV0Yy5cbiAgICAgICAgc3dpdGNoICh2aW0ubGFzdE1vdGlvbikge1xuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlQnlMaW5lczpcbiAgICAgICAgICBjYXNlIHRoaXMubW92ZUJ5RGlzcGxheUxpbmVzOlxuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlQnlTY3JvbGw6XG4gICAgICAgICAgY2FzZSB0aGlzLm1vdmVUb0NvbHVtbjpcbiAgICAgICAgICBjYXNlIHRoaXMubW92ZVRvRW9sOlxuICAgICAgICAgICAgZW5kQ2ggPSB2aW0ubGFzdEhQb3M7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmltLmxhc3RIUG9zID0gZW5kQ2g7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0Kyhtb3Rpb25BcmdzLnJlcGVhdE9mZnNldHx8MCk7XG4gICAgICAgIHZhciBsaW5lID0gbW90aW9uQXJncy5mb3J3YXJkID8gY3VyLmxpbmUgKyByZXBlYXQgOiBjdXIubGluZSAtIHJlcGVhdDtcbiAgICAgICAgdmFyIGZpcnN0ID0gY20uZmlyc3RMaW5lKCk7XG4gICAgICAgIHZhciBsYXN0ID0gY20ubGFzdExpbmUoKTtcbiAgICAgICAgLy8gVmltIGdvIHRvIGxpbmUgYmVnaW4gb3IgbGluZSBlbmQgd2hlbiBjdXJzb3IgYXQgZmlyc3QvbGFzdCBsaW5lIGFuZFxuICAgICAgICAvLyBtb3ZlIHRvIHByZXZpb3VzL25leHQgbGluZSBpcyB0cmlnZ2VyZWQuXG4gICAgICAgIGlmIChsaW5lIDwgZmlyc3QgJiYgY3VyLmxpbmUgPT0gZmlyc3Qpe1xuICAgICAgICAgIHJldHVybiB0aGlzLm1vdmVUb1N0YXJ0T2ZMaW5lKGNtLCBoZWFkLCBtb3Rpb25BcmdzLCB2aW0pO1xuICAgICAgICB9ZWxzZSBpZiAobGluZSA+IGxhc3QgJiYgY3VyLmxpbmUgPT0gbGFzdCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tb3ZlVG9Fb2woY20sIGhlYWQsIG1vdGlvbkFyZ3MsIHZpbSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vdGlvbkFyZ3MudG9GaXJzdENoYXIpe1xuICAgICAgICAgIGVuZENoPWZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShsaW5lKSk7XG4gICAgICAgICAgdmltLmxhc3RIUG9zID0gZW5kQ2g7XG4gICAgICAgIH1cbiAgICAgICAgdmltLmxhc3RIU1BvcyA9IGNtLmNoYXJDb29yZHMoUG9zKGxpbmUsIGVuZENoKSwnZGl2JykubGVmdDtcbiAgICAgICAgcmV0dXJuIFBvcyhsaW5lLCBlbmRDaCk7XG4gICAgICB9LFxuICAgICAgbW92ZUJ5RGlzcGxheUxpbmVzOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBjdXIgPSBoZWFkO1xuICAgICAgICBzd2l0Y2ggKHZpbS5sYXN0TW90aW9uKSB7XG4gICAgICAgICAgY2FzZSB0aGlzLm1vdmVCeURpc3BsYXlMaW5lczpcbiAgICAgICAgICBjYXNlIHRoaXMubW92ZUJ5U2Nyb2xsOlxuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlQnlMaW5lczpcbiAgICAgICAgICBjYXNlIHRoaXMubW92ZVRvQ29sdW1uOlxuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlVG9Fb2w6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmltLmxhc3RIU1BvcyA9IGNtLmNoYXJDb29yZHMoY3VyLCdkaXYnKS5sZWZ0O1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXBlYXQgPSBtb3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgdmFyIHJlcz1jbS5maW5kUG9zVihjdXIsKG1vdGlvbkFyZ3MuZm9yd2FyZCA/IHJlcGVhdCA6IC1yZXBlYXQpLCdsaW5lJyx2aW0ubGFzdEhTUG9zKTtcbiAgICAgICAgaWYgKHJlcy5oaXRTaWRlKSB7XG4gICAgICAgICAgaWYgKG1vdGlvbkFyZ3MuZm9yd2FyZCkge1xuICAgICAgICAgICAgdmFyIGxhc3RDaGFyQ29vcmRzID0gY20uY2hhckNvb3JkcyhyZXMsICdkaXYnKTtcbiAgICAgICAgICAgIHZhciBnb2FsQ29vcmRzID0geyB0b3A6IGxhc3RDaGFyQ29vcmRzLnRvcCArIDgsIGxlZnQ6IHZpbS5sYXN0SFNQb3MgfTtcbiAgICAgICAgICAgIHZhciByZXMgPSBjbS5jb29yZHNDaGFyKGdvYWxDb29yZHMsICdkaXYnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlc0Nvb3JkcyA9IGNtLmNoYXJDb29yZHMoUG9zKGNtLmZpcnN0TGluZSgpLCAwKSwgJ2RpdicpO1xuICAgICAgICAgICAgcmVzQ29vcmRzLmxlZnQgPSB2aW0ubGFzdEhTUG9zO1xuICAgICAgICAgICAgcmVzID0gY20uY29vcmRzQ2hhcihyZXNDb29yZHMsICdkaXYnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmltLmxhc3RIUG9zID0gcmVzLmNoO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSxcbiAgICAgIG1vdmVCeVBhZ2U6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIC8vIENvZGVNaXJyb3Igb25seSBleHBvc2VzIGZ1bmN0aW9ucyB0aGF0IG1vdmUgdGhlIGN1cnNvciBwYWdlIGRvd24sIHNvXG4gICAgICAgIC8vIGRvaW5nIHRoaXMgYmFkIGhhY2sgdG8gbW92ZSB0aGUgY3Vyc29yIGFuZCBtb3ZlIGl0IGJhY2suIGV2YWxJbnB1dFxuICAgICAgICAvLyB3aWxsIG1vdmUgdGhlIGN1cnNvciB0byB3aGVyZSBpdCBzaG91bGQgYmUgaW4gdGhlIGVuZC5cbiAgICAgICAgdmFyIGN1clN0YXJ0ID0gaGVhZDtcbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0O1xuICAgICAgICByZXR1cm4gY20uZmluZFBvc1YoY3VyU3RhcnQsIChtb3Rpb25BcmdzLmZvcndhcmQgPyByZXBlYXQgOiAtcmVwZWF0KSwgJ3BhZ2UnKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlQnlQYXJhZ3JhcGg6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBkaXIgPSBtb3Rpb25BcmdzLmZvcndhcmQgPyAxIDogLTE7XG4gICAgICAgIHJldHVybiBmaW5kUGFyYWdyYXBoKGNtLCBoZWFkLCBtb3Rpb25BcmdzLnJlcGVhdCwgZGlyKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlQnlTZW50ZW5jZTogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIGRpciA9IG1vdGlvbkFyZ3MuZm9yd2FyZCA/IDEgOiAtMTtcbiAgICAgICAgcmV0dXJuIGZpbmRTZW50ZW5jZShjbSwgaGVhZCwgbW90aW9uQXJncy5yZXBlYXQsIGRpcik7XG4gICAgICB9LFxuICAgICAgbW92ZUJ5U2Nyb2xsOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBzY3JvbGxib3ggPSBjbS5nZXRTY3JvbGxJbmZvKCk7XG4gICAgICAgIHZhciBjdXJFbmQgPSBudWxsO1xuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIGlmICghcmVwZWF0KSB7XG4gICAgICAgICAgcmVwZWF0ID0gc2Nyb2xsYm94LmNsaWVudEhlaWdodCAvICgyICogY20uZGVmYXVsdFRleHRIZWlnaHQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9yaWcgPSBjbS5jaGFyQ29vcmRzKGhlYWQsICdsb2NhbCcpO1xuICAgICAgICBtb3Rpb25BcmdzLnJlcGVhdCA9IHJlcGVhdDtcbiAgICAgICAgdmFyIGN1ckVuZCA9IG1vdGlvbnMubW92ZUJ5RGlzcGxheUxpbmVzKGNtLCBoZWFkLCBtb3Rpb25BcmdzLCB2aW0pO1xuICAgICAgICBpZiAoIWN1ckVuZCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZXN0ID0gY20uY2hhckNvb3JkcyhjdXJFbmQsICdsb2NhbCcpO1xuICAgICAgICBjbS5zY3JvbGxUbyhudWxsLCBzY3JvbGxib3gudG9wICsgZGVzdC50b3AgLSBvcmlnLnRvcCk7XG4gICAgICAgIHJldHVybiBjdXJFbmQ7XG4gICAgICB9LFxuICAgICAgbW92ZUJ5V29yZHM6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIHJldHVybiBtb3ZlVG9Xb3JkKGNtLCBoZWFkLCBtb3Rpb25BcmdzLnJlcGVhdCwgISFtb3Rpb25BcmdzLmZvcndhcmQsXG4gICAgICAgICAgICAhIW1vdGlvbkFyZ3Mud29yZEVuZCwgISFtb3Rpb25BcmdzLmJpZ1dvcmQpO1xuICAgICAgfSxcbiAgICAgIG1vdmVUaWxsQ2hhcmFjdGVyOiBmdW5jdGlvbihjbSwgX2hlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0O1xuICAgICAgICB2YXIgY3VyRW5kID0gbW92ZVRvQ2hhcmFjdGVyKGNtLCByZXBlYXQsIG1vdGlvbkFyZ3MuZm9yd2FyZCxcbiAgICAgICAgICAgIG1vdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXIpO1xuICAgICAgICB2YXIgaW5jcmVtZW50ID0gbW90aW9uQXJncy5mb3J3YXJkID8gLTEgOiAxO1xuICAgICAgICByZWNvcmRMYXN0Q2hhcmFjdGVyU2VhcmNoKGluY3JlbWVudCwgbW90aW9uQXJncyk7XG4gICAgICAgIGlmICghY3VyRW5kKSByZXR1cm4gbnVsbDtcbiAgICAgICAgY3VyRW5kLmNoICs9IGluY3JlbWVudDtcbiAgICAgICAgcmV0dXJuIGN1ckVuZDtcbiAgICAgIH0sXG4gICAgICBtb3ZlVG9DaGFyYWN0ZXI6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciByZXBlYXQgPSBtb3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgcmVjb3JkTGFzdENoYXJhY3RlclNlYXJjaCgwLCBtb3Rpb25BcmdzKTtcbiAgICAgICAgcmV0dXJuIG1vdmVUb0NoYXJhY3RlcihjbSwgcmVwZWF0LCBtb3Rpb25BcmdzLmZvcndhcmQsXG4gICAgICAgICAgICBtb3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyKSB8fCBoZWFkO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb1N5bWJvbDogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0O1xuICAgICAgICByZXR1cm4gZmluZFN5bWJvbChjbSwgcmVwZWF0LCBtb3Rpb25BcmdzLmZvcndhcmQsXG4gICAgICAgICAgICBtb3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyKSB8fCBoZWFkO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb0NvbHVtbjogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIC8vIHJlcGVhdCBpcyBlcXVpdmFsZW50IHRvIHdoaWNoIGNvbHVtbiB3ZSB3YW50IHRvIG1vdmUgdG8hXG4gICAgICAgIHZpbS5sYXN0SFBvcyA9IHJlcGVhdCAtIDE7XG4gICAgICAgIHZpbS5sYXN0SFNQb3MgPSBjbS5jaGFyQ29vcmRzKGhlYWQsJ2RpdicpLmxlZnQ7XG4gICAgICAgIHJldHVybiBtb3ZlVG9Db2x1bW4oY20sIHJlcGVhdCk7XG4gICAgICB9LFxuICAgICAgbW92ZVRvRW9sOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncywgdmltLCBrZWVwSFBvcykge1xuICAgICAgICB2YXIgY3VyID0gaGVhZDtcbiAgICAgICAgdmFyIHJldHZhbD0gUG9zKGN1ci5saW5lICsgbW90aW9uQXJncy5yZXBlYXQgLSAxLCBJbmZpbml0eSk7XG4gICAgICAgIHZhciBlbmQ9Y20uY2xpcFBvcyhyZXR2YWwpO1xuICAgICAgICBlbmQuY2gtLTtcbiAgICAgICAgaWYgKCFrZWVwSFBvcykge1xuICAgICAgICAgIHZpbS5sYXN0SFBvcyA9IEluZmluaXR5O1xuICAgICAgICAgIHZpbS5sYXN0SFNQb3MgPSBjbS5jaGFyQ29vcmRzKGVuZCwnZGl2JykubGVmdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0dmFsO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcjogZnVuY3Rpb24oY20sIGhlYWQpIHtcbiAgICAgICAgLy8gR28gdG8gdGhlIHN0YXJ0IG9mIHRoZSBsaW5lIHdoZXJlIHRoZSB0ZXh0IGJlZ2lucywgb3IgdGhlIGVuZCBmb3JcbiAgICAgICAgLy8gd2hpdGVzcGFjZS1vbmx5IGxpbmVzXG4gICAgICAgIHZhciBjdXJzb3IgPSBoZWFkO1xuICAgICAgICByZXR1cm4gUG9zKGN1cnNvci5saW5lLFxuICAgICAgICAgICAgICAgICAgIGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShjdXJzb3IubGluZSkpKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlVG9NYXRjaGVkU3ltYm9sOiBmdW5jdGlvbihjbSwgaGVhZCkge1xuICAgICAgICB2YXIgY3Vyc29yID0gaGVhZDtcbiAgICAgICAgdmFyIGxpbmUgPSBjdXJzb3IubGluZTtcbiAgICAgICAgdmFyIGNoID0gY3Vyc29yLmNoO1xuICAgICAgICB2YXIgbGluZVRleHQgPSBjbS5nZXRMaW5lKGxpbmUpO1xuICAgICAgICB2YXIgc3ltYm9sO1xuICAgICAgICBmb3IgKDsgY2ggPCBsaW5lVGV4dC5sZW5ndGg7IGNoKyspIHtcbiAgICAgICAgICBzeW1ib2wgPSBsaW5lVGV4dC5jaGFyQXQoY2gpO1xuICAgICAgICAgIGlmIChzeW1ib2wgJiYgaXNNYXRjaGFibGVTeW1ib2woc3ltYm9sKSkge1xuICAgICAgICAgICAgdmFyIHN0eWxlID0gY20uZ2V0VG9rZW5UeXBlQXQoUG9zKGxpbmUsIGNoICsgMSkpO1xuICAgICAgICAgICAgaWYgKHN0eWxlICE9PSBcInN0cmluZ1wiICYmIHN0eWxlICE9PSBcImNvbW1lbnRcIikge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoIDwgbGluZVRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgLy8gT25seSBpbmNsdWRlIGFuZ2xlIGJyYWNrZXRzIGluIGFuYWx5c2lzIGlmIHRoZXkgYXJlIGJlaW5nIG1hdGNoZWQuXG4gICAgICAgICAgdmFyIHJlID0gKGNoID09PSAnPCcgfHwgY2ggPT09ICc+JykgPyAvWygpe31bXFxdPD5dLyA6IC9bKCl7fVtcXF1dLztcbiAgICAgICAgICB2YXIgbWF0Y2hlZCA9IGNtLmZpbmRNYXRjaGluZ0JyYWNrZXQoUG9zKGxpbmUsIGNoKSwge2JyYWNrZXRSZWdleDogcmV9KTtcbiAgICAgICAgICByZXR1cm4gbWF0Y2hlZC50bztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gY3Vyc29yO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbW92ZVRvU3RhcnRPZkxpbmU6IGZ1bmN0aW9uKF9jbSwgaGVhZCkge1xuICAgICAgICByZXR1cm4gUG9zKGhlYWQubGluZSwgMCk7XG4gICAgICB9LFxuICAgICAgbW92ZVRvTGluZU9yRWRnZU9mRG9jdW1lbnQ6IGZ1bmN0aW9uKGNtLCBfaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgbGluZU51bSA9IG1vdGlvbkFyZ3MuZm9yd2FyZCA/IGNtLmxhc3RMaW5lKCkgOiBjbS5maXJzdExpbmUoKTtcbiAgICAgICAgaWYgKG1vdGlvbkFyZ3MucmVwZWF0SXNFeHBsaWNpdCkge1xuICAgICAgICAgIGxpbmVOdW0gPSBtb3Rpb25BcmdzLnJlcGVhdCAtIGNtLmdldE9wdGlvbignZmlyc3RMaW5lTnVtYmVyJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFBvcyhsaW5lTnVtLFxuICAgICAgICAgICAgICAgICAgIGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShsaW5lTnVtKSkpO1xuICAgICAgfSxcbiAgICAgIHRleHRPYmplY3RNYW5pcHVsYXRpb246IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgLy8gVE9ETzogbG90cyBvZiBwb3NzaWJsZSBleGNlcHRpb25zIHRoYXQgY2FuIGJlIHRocm93biBoZXJlLiBUcnkgZGEoXG4gICAgICAgIC8vICAgICBvdXRzaWRlIG9mIGEgKCkgYmxvY2suXG4gICAgICAgIHZhciBtaXJyb3JlZFBhaXJzID0geycoJzogJyknLCAnKSc6ICcoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3snOiAnfScsICd9JzogJ3snLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnWyc6ICddJywgJ10nOiAnWycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8JzogJz4nLCAnPic6ICc8J307XG4gICAgICAgIHZhciBzZWxmUGFpcmVkID0geydcXCcnOiB0cnVlLCAnXCInOiB0cnVlLCAnYCc6IHRydWV9O1xuXG4gICAgICAgIHZhciBjaGFyYWN0ZXIgPSBtb3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyO1xuICAgICAgICAvLyAnYicgcmVmZXJzIHRvICAnKCknIGJsb2NrLlxuICAgICAgICAvLyAnQicgcmVmZXJzIHRvICAne30nIGJsb2NrLlxuICAgICAgICBpZiAoY2hhcmFjdGVyID09ICdiJykge1xuICAgICAgICAgIGNoYXJhY3RlciA9ICcoJztcbiAgICAgICAgfSBlbHNlIGlmIChjaGFyYWN0ZXIgPT0gJ0InKSB7XG4gICAgICAgICAgY2hhcmFjdGVyID0gJ3snO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW5jbHVzaXZlIGlzIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gYSBhbmQgaVxuICAgICAgICAvLyBUT0RPOiBJbnN0ZWFkIG9mIHVzaW5nIHRoZSBhZGRpdGlvbmFsIHRleHQgb2JqZWN0IG1hcCB0byBwZXJmb3JtIHRleHRcbiAgICAgICAgLy8gICAgIG9iamVjdCBvcGVyYXRpb25zLCBtZXJnZSB0aGUgbWFwIGludG8gdGhlIGRlZmF1bHRLZXlNYXAgYW5kIHVzZVxuICAgICAgICAvLyAgICAgbW90aW9uQXJncyB0byBkZWZpbmUgYmVoYXZpb3IuIERlZmluZSBzZXBhcmF0ZSBlbnRyaWVzIGZvciAnYXcnLFxuICAgICAgICAvLyAgICAgJ2l3JywgJ2FbJywgJ2lbJywgZXRjLlxuICAgICAgICB2YXIgaW5jbHVzaXZlID0gIW1vdGlvbkFyZ3MudGV4dE9iamVjdElubmVyO1xuXG4gICAgICAgIHZhciB0bXA7XG4gICAgICAgIGlmIChtaXJyb3JlZFBhaXJzW2NoYXJhY3Rlcl0pIHtcbiAgICAgICAgICB0bXAgPSBzZWxlY3RDb21wYW5pb25PYmplY3QoY20sIGhlYWQsIGNoYXJhY3RlciwgaW5jbHVzaXZlKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxmUGFpcmVkW2NoYXJhY3Rlcl0pIHtcbiAgICAgICAgICB0bXAgPSBmaW5kQmVnaW5uaW5nQW5kRW5kKGNtLCBoZWFkLCBjaGFyYWN0ZXIsIGluY2x1c2l2ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnVycpIHtcbiAgICAgICAgICB0bXAgPSBleHBhbmRXb3JkVW5kZXJDdXJzb3IoY20sIGluY2x1c2l2ZSwgdHJ1ZSAvKiogZm9yd2FyZCAqLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSAvKiogYmlnV29yZCAqLyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhcmFjdGVyID09PSAndycpIHtcbiAgICAgICAgICB0bXAgPSBleHBhbmRXb3JkVW5kZXJDdXJzb3IoY20sIGluY2x1c2l2ZSwgdHJ1ZSAvKiogZm9yd2FyZCAqLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgLyoqIGJpZ1dvcmQgKi8pO1xuICAgICAgICB9IGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gJ3AnKSB7XG4gICAgICAgICAgdG1wID0gZmluZFBhcmFncmFwaChjbSwgaGVhZCwgbW90aW9uQXJncy5yZXBlYXQsIDAsIGluY2x1c2l2ZSk7XG4gICAgICAgICAgbW90aW9uQXJncy5saW5ld2lzZSA9IHRydWU7XG4gICAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgICBpZiAoIXZpbS52aXN1YWxMaW5lKSB7IHZpbS52aXN1YWxMaW5lID0gdHJ1ZTsgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgb3BlcmF0b3JBcmdzID0gdmltLmlucHV0U3RhdGUub3BlcmF0b3JBcmdzO1xuICAgICAgICAgICAgaWYgKG9wZXJhdG9yQXJncykgeyBvcGVyYXRvckFyZ3MubGluZXdpc2UgPSB0cnVlOyB9XG4gICAgICAgICAgICB0bXAuZW5kLmxpbmUtLTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTm8gdGV4dCBvYmplY3QgZGVmaW5lZCBmb3IgdGhpcywgZG9uJ3QgbW92ZS5cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY20uc3RhdGUudmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICByZXR1cm4gW3RtcC5zdGFydCwgdG1wLmVuZF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGV4cGFuZFNlbGVjdGlvbihjbSwgdG1wLnN0YXJ0LCB0bXAuZW5kKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgcmVwZWF0TGFzdENoYXJhY3RlclNlYXJjaDogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIGxhc3RTZWFyY2ggPSB2aW1HbG9iYWxTdGF0ZS5sYXN0Q2hhcmFjdGVyU2VhcmNoO1xuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHZhciBmb3J3YXJkID0gbW90aW9uQXJncy5mb3J3YXJkID09PSBsYXN0U2VhcmNoLmZvcndhcmQ7XG4gICAgICAgIHZhciBpbmNyZW1lbnQgPSAobGFzdFNlYXJjaC5pbmNyZW1lbnQgPyAxIDogMCkgKiAoZm9yd2FyZCA/IC0xIDogMSk7XG4gICAgICAgIGNtLm1vdmVIKC1pbmNyZW1lbnQsICdjaGFyJyk7XG4gICAgICAgIG1vdGlvbkFyZ3MuaW5jbHVzaXZlID0gZm9yd2FyZCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgdmFyIGN1ckVuZCA9IG1vdmVUb0NoYXJhY3RlcihjbSwgcmVwZWF0LCBmb3J3YXJkLCBsYXN0U2VhcmNoLnNlbGVjdGVkQ2hhcmFjdGVyKTtcbiAgICAgICAgaWYgKCFjdXJFbmQpIHtcbiAgICAgICAgICBjbS5tb3ZlSChpbmNyZW1lbnQsICdjaGFyJyk7XG4gICAgICAgICAgcmV0dXJuIGhlYWQ7XG4gICAgICAgIH1cbiAgICAgICAgY3VyRW5kLmNoICs9IGluY3JlbWVudDtcbiAgICAgICAgcmV0dXJuIGN1ckVuZDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZGVmaW5lTW90aW9uKG5hbWUsIGZuKSB7XG4gICAgICBtb3Rpb25zW25hbWVdID0gZm47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsbEFycmF5KHZhbCwgdGltZXMpIHtcbiAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkrKykge1xuICAgICAgICBhcnIucHVzaCh2YWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFycjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQW4gb3BlcmF0b3IgYWN0cyBvbiBhIHRleHQgc2VsZWN0aW9uLiBJdCByZWNlaXZlcyB0aGUgbGlzdCBvZiBzZWxlY3Rpb25zXG4gICAgICogYXMgaW5wdXQuIFRoZSBjb3JyZXNwb25kaW5nIENvZGVNaXJyb3Igc2VsZWN0aW9uIGlzIGd1YXJhbnRlZWQgdG9cbiAgICAqIG1hdGNoIHRoZSBpbnB1dCBzZWxlY3Rpb24uXG4gICAgICovXG4gICAgdmFyIG9wZXJhdG9ycyA9IHtcbiAgICAgIGNoYW5nZTogZnVuY3Rpb24oY20sIGFyZ3MsIHJhbmdlcykge1xuICAgICAgICB2YXIgZmluYWxIZWFkLCB0ZXh0O1xuICAgICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgICBpZiAoIXZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgdmFyIGFuY2hvciA9IHJhbmdlc1swXS5hbmNob3IsXG4gICAgICAgICAgICAgIGhlYWQgPSByYW5nZXNbMF0uaGVhZDtcbiAgICAgICAgICB0ZXh0ID0gY20uZ2V0UmFuZ2UoYW5jaG9yLCBoZWFkKTtcbiAgICAgICAgICB2YXIgbGFzdFN0YXRlID0gdmltLmxhc3RFZGl0SW5wdXRTdGF0ZSB8fCB7fTtcbiAgICAgICAgICBpZiAobGFzdFN0YXRlLm1vdGlvbiA9PSBcIm1vdmVCeVdvcmRzXCIgJiYgIWlzV2hpdGVTcGFjZVN0cmluZyh0ZXh0KSkge1xuICAgICAgICAgICAgLy8gRXhjbHVkZSB0cmFpbGluZyB3aGl0ZXNwYWNlIGlmIHRoZSByYW5nZSBpcyBub3QgYWxsIHdoaXRlc3BhY2UuXG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSAoL1xccyskLykuZXhlYyh0ZXh0KTtcbiAgICAgICAgICAgIGlmIChtYXRjaCAmJiBsYXN0U3RhdGUubW90aW9uQXJncyAmJiBsYXN0U3RhdGUubW90aW9uQXJncy5mb3J3YXJkKSB7XG4gICAgICAgICAgICAgIGhlYWQgPSBvZmZzZXRDdXJzb3IoaGVhZCwgMCwgLSBtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5zbGljZSgwLCAtIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBwcmV2TGluZUVuZCA9IG5ldyBQb3MoYW5jaG9yLmxpbmUgLSAxLCBOdW1iZXIuTUFYX1ZBTFVFKTtcbiAgICAgICAgICB2YXIgd2FzTGFzdExpbmUgPSBjbS5maXJzdExpbmUoKSA9PSBjbS5sYXN0TGluZSgpO1xuICAgICAgICAgIGlmIChoZWFkLmxpbmUgPiBjbS5sYXN0TGluZSgpICYmIGFyZ3MubGluZXdpc2UgJiYgIXdhc0xhc3RMaW5lKSB7XG4gICAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UoJycsIHByZXZMaW5lRW5kLCBoZWFkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKCcnLCBhbmNob3IsIGhlYWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYXJncy5saW5ld2lzZSkge1xuICAgICAgICAgICAgLy8gUHVzaCB0aGUgbmV4dCBsaW5lIGJhY2sgZG93biwgaWYgdGhlcmUgaXMgYSBuZXh0IGxpbmUuXG4gICAgICAgICAgICBpZiAoIXdhc0xhc3RMaW5lKSB7XG4gICAgICAgICAgICAgIGNtLnNldEN1cnNvcihwcmV2TGluZUVuZCk7XG4gICAgICAgICAgICAgIENvZGVNaXJyb3IuY29tbWFuZHMubmV3bGluZUFuZEluZGVudChjbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgY3Vyc29yIGVuZHMgdXAgYXQgdGhlIGVuZCBvZiB0aGUgbGluZS5cbiAgICAgICAgICAgIGFuY2hvci5jaCA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbmFsSGVhZCA9IGFuY2hvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0ID0gY20uZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gZmlsbEFycmF5KCcnLCByYW5nZXMubGVuZ3RoKTtcbiAgICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9ucyhyZXBsYWNlbWVudCk7XG4gICAgICAgICAgZmluYWxIZWFkID0gY3Vyc29yTWluKHJhbmdlc1swXS5oZWFkLCByYW5nZXNbMF0uYW5jaG9yKTtcbiAgICAgICAgfVxuICAgICAgICB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIucHVzaFRleHQoXG4gICAgICAgICAgICBhcmdzLnJlZ2lzdGVyTmFtZSwgJ2NoYW5nZScsIHRleHQsXG4gICAgICAgICAgICBhcmdzLmxpbmV3aXNlLCByYW5nZXMubGVuZ3RoID4gMSk7XG4gICAgICAgIGFjdGlvbnMuZW50ZXJJbnNlcnRNb2RlKGNtLCB7aGVhZDogZmluYWxIZWFkfSwgY20uc3RhdGUudmltKTtcbiAgICAgIH0sXG4gICAgICAvLyBkZWxldGUgaXMgYSBqYXZhc2NyaXB0IGtleXdvcmQuXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oY20sIGFyZ3MsIHJhbmdlcykge1xuICAgICAgICB2YXIgZmluYWxIZWFkLCB0ZXh0O1xuICAgICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgICBpZiAoIXZpbS52aXN1YWxCbG9jaykge1xuICAgICAgICAgIHZhciBhbmNob3IgPSByYW5nZXNbMF0uYW5jaG9yLFxuICAgICAgICAgICAgICBoZWFkID0gcmFuZ2VzWzBdLmhlYWQ7XG4gICAgICAgICAgaWYgKGFyZ3MubGluZXdpc2UgJiZcbiAgICAgICAgICAgICAgaGVhZC5saW5lICE9IGNtLmZpcnN0TGluZSgpICYmXG4gICAgICAgICAgICAgIGFuY2hvci5saW5lID09IGNtLmxhc3RMaW5lKCkgJiZcbiAgICAgICAgICAgICAgYW5jaG9yLmxpbmUgPT0gaGVhZC5saW5lIC0gMSkge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBkZCBvbiBsYXN0IGxpbmUgKGFuZCBmaXJzdCBsaW5lKS5cbiAgICAgICAgICAgIGlmIChhbmNob3IubGluZSA9PSBjbS5maXJzdExpbmUoKSkge1xuICAgICAgICAgICAgICBhbmNob3IuY2ggPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYW5jaG9yID0gUG9zKGFuY2hvci5saW5lIC0gMSwgbGluZUxlbmd0aChjbSwgYW5jaG9yLmxpbmUgLSAxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRleHQgPSBjbS5nZXRSYW5nZShhbmNob3IsIGhlYWQpO1xuICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSgnJywgYW5jaG9yLCBoZWFkKTtcbiAgICAgICAgICBmaW5hbEhlYWQgPSBhbmNob3I7XG4gICAgICAgICAgaWYgKGFyZ3MubGluZXdpc2UpIHtcbiAgICAgICAgICAgIGZpbmFsSGVhZCA9IG1vdGlvbnMubW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLCBhbmNob3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0ID0gY20uZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gZmlsbEFycmF5KCcnLCByYW5nZXMubGVuZ3RoKTtcbiAgICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9ucyhyZXBsYWNlbWVudCk7XG4gICAgICAgICAgZmluYWxIZWFkID0gcmFuZ2VzWzBdLmFuY2hvcjtcbiAgICAgICAgfVxuICAgICAgICB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIucHVzaFRleHQoXG4gICAgICAgICAgICBhcmdzLnJlZ2lzdGVyTmFtZSwgJ2RlbGV0ZScsIHRleHQsXG4gICAgICAgICAgICBhcmdzLmxpbmV3aXNlLCB2aW0udmlzdWFsQmxvY2spO1xuICAgICAgICB2YXIgaW5jbHVkZUxpbmVCcmVhayA9IHZpbS5pbnNlcnRNb2RlXG4gICAgICAgIHJldHVybiBjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCBmaW5hbEhlYWQsIGluY2x1ZGVMaW5lQnJlYWspO1xuICAgICAgfSxcbiAgICAgIGluZGVudDogZnVuY3Rpb24oY20sIGFyZ3MsIHJhbmdlcykge1xuICAgICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgICB2YXIgc3RhcnRMaW5lID0gcmFuZ2VzWzBdLmFuY2hvci5saW5lO1xuICAgICAgICB2YXIgZW5kTGluZSA9IHZpbS52aXN1YWxCbG9jayA/XG4gICAgICAgICAgcmFuZ2VzW3Jhbmdlcy5sZW5ndGggLSAxXS5hbmNob3IubGluZSA6XG4gICAgICAgICAgcmFuZ2VzWzBdLmhlYWQubGluZTtcbiAgICAgICAgLy8gSW4gdmlzdWFsIG1vZGUsIG4+IHNoaWZ0cyB0aGUgc2VsZWN0aW9uIHJpZ2h0IG4gdGltZXMsIGluc3RlYWQgb2ZcbiAgICAgICAgLy8gc2hpZnRpbmcgbiBsaW5lcyByaWdodCBvbmNlLlxuICAgICAgICB2YXIgcmVwZWF0ID0gKHZpbS52aXN1YWxNb2RlKSA/IGFyZ3MucmVwZWF0IDogMTtcbiAgICAgICAgaWYgKGFyZ3MubGluZXdpc2UpIHtcbiAgICAgICAgICAvLyBUaGUgb25seSB3YXkgdG8gZGVsZXRlIGEgbmV3bGluZSBpcyB0byBkZWxldGUgdW50aWwgdGhlIHN0YXJ0IG9mXG4gICAgICAgICAgLy8gdGhlIG5leHQgbGluZSwgc28gaW4gbGluZXdpc2UgbW9kZSBldmFsSW5wdXQgd2lsbCBpbmNsdWRlIHRoZSBuZXh0XG4gICAgICAgICAgLy8gbGluZS4gV2UgZG9uJ3Qgd2FudCB0aGlzIGluIGluZGVudCwgc28gd2UgZ28gYmFjayBhIGxpbmUuXG4gICAgICAgICAgZW5kTGluZS0tO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSBzdGFydExpbmU7IGkgPD0gZW5kTGluZTsgaSsrKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByZXBlYXQ7IGorKykge1xuICAgICAgICAgICAgY20uaW5kZW50TGluZShpLCBhcmdzLmluZGVudFJpZ2h0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vdGlvbnMubW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLCByYW5nZXNbMF0uYW5jaG9yKTtcbiAgICAgIH0sXG4gICAgICBpbmRlbnRBdXRvOiBmdW5jdGlvbihjbSwgX2FyZ3MsIHJhbmdlcykge1xuICAgICAgICBjbS5leGVjQ29tbWFuZChcImluZGVudEF1dG9cIik7XG4gICAgICAgIHJldHVybiBtb3Rpb25zLm1vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbSwgcmFuZ2VzWzBdLmFuY2hvcik7XG4gICAgICB9LFxuICAgICAgY2hhbmdlQ2FzZTogZnVuY3Rpb24oY20sIGFyZ3MsIHJhbmdlcywgb2xkQW5jaG9yLCBuZXdIZWFkKSB7XG4gICAgICAgIHZhciBzZWxlY3Rpb25zID0gY20uZ2V0U2VsZWN0aW9ucygpO1xuICAgICAgICB2YXIgc3dhcHBlZCA9IFtdO1xuICAgICAgICB2YXIgdG9Mb3dlciA9IGFyZ3MudG9Mb3dlcjtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzZWxlY3Rpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgdmFyIHRvU3dhcCA9IHNlbGVjdGlvbnNbal07XG4gICAgICAgICAgdmFyIHRleHQgPSAnJztcbiAgICAgICAgICBpZiAodG9Mb3dlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGV4dCA9IHRvU3dhcC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodG9Mb3dlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRleHQgPSB0b1N3YXAudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b1N3YXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIGNoYXJhY3RlciA9IHRvU3dhcC5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgIHRleHQgKz0gaXNVcHBlckNhc2UoY2hhcmFjdGVyKSA/IGNoYXJhY3Rlci50b0xvd2VyQ2FzZSgpIDpcbiAgICAgICAgICAgICAgICAgIGNoYXJhY3Rlci50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzd2FwcGVkLnB1c2godGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY20ucmVwbGFjZVNlbGVjdGlvbnMoc3dhcHBlZCk7XG4gICAgICAgIGlmIChhcmdzLnNob3VsZE1vdmVDdXJzb3Ipe1xuICAgICAgICAgIHJldHVybiBuZXdIZWFkO1xuICAgICAgICB9IGVsc2UgaWYgKCFjbS5zdGF0ZS52aW0udmlzdWFsTW9kZSAmJiBhcmdzLmxpbmV3aXNlICYmIHJhbmdlc1swXS5hbmNob3IubGluZSArIDEgPT0gcmFuZ2VzWzBdLmhlYWQubGluZSkge1xuICAgICAgICAgIHJldHVybiBtb3Rpb25zLm1vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbSwgb2xkQW5jaG9yKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxpbmV3aXNlKXtcbiAgICAgICAgICByZXR1cm4gb2xkQW5jaG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjdXJzb3JNaW4ocmFuZ2VzWzBdLmFuY2hvciwgcmFuZ2VzWzBdLmhlYWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgeWFuazogZnVuY3Rpb24oY20sIGFyZ3MsIHJhbmdlcywgb2xkQW5jaG9yKSB7XG4gICAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICAgIHZhciB0ZXh0ID0gY20uZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgIHZhciBlbmRQb3MgPSB2aW0udmlzdWFsTW9kZVxuICAgICAgICAgID8gY3Vyc29yTWluKHZpbS5zZWwuYW5jaG9yLCB2aW0uc2VsLmhlYWQsIHJhbmdlc1swXS5oZWFkLCByYW5nZXNbMF0uYW5jaG9yKVxuICAgICAgICAgIDogb2xkQW5jaG9yO1xuICAgICAgICB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIucHVzaFRleHQoXG4gICAgICAgICAgICBhcmdzLnJlZ2lzdGVyTmFtZSwgJ3lhbmsnLFxuICAgICAgICAgICAgdGV4dCwgYXJncy5saW5ld2lzZSwgdmltLnZpc3VhbEJsb2NrKTtcbiAgICAgICAgcmV0dXJuIGVuZFBvcztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZGVmaW5lT3BlcmF0b3IobmFtZSwgZm4pIHtcbiAgICAgIG9wZXJhdG9yc1tuYW1lXSA9IGZuO1xuICAgIH1cblxuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAganVtcExpc3RXYWxrOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVwZWF0ID0gYWN0aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHZhciBmb3J3YXJkID0gYWN0aW9uQXJncy5mb3J3YXJkO1xuICAgICAgICB2YXIganVtcExpc3QgPSB2aW1HbG9iYWxTdGF0ZS5qdW1wTGlzdDtcblxuICAgICAgICB2YXIgbWFyayA9IGp1bXBMaXN0Lm1vdmUoY20sIGZvcndhcmQgPyByZXBlYXQgOiAtcmVwZWF0KTtcbiAgICAgICAgdmFyIG1hcmtQb3MgPSBtYXJrID8gbWFyay5maW5kKCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIG1hcmtQb3MgPSBtYXJrUG9zID8gbWFya1BvcyA6IGNtLmdldEN1cnNvcigpO1xuICAgICAgICBjbS5zZXRDdXJzb3IobWFya1Bvcyk7XG4gICAgICB9LFxuICAgICAgc2Nyb2xsOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVwZWF0ID0gYWN0aW9uQXJncy5yZXBlYXQgfHwgMTtcbiAgICAgICAgdmFyIGxpbmVIZWlnaHQgPSBjbS5kZWZhdWx0VGV4dEhlaWdodCgpO1xuICAgICAgICB2YXIgdG9wID0gY20uZ2V0U2Nyb2xsSW5mbygpLnRvcDtcbiAgICAgICAgdmFyIGRlbHRhID0gbGluZUhlaWdodCAqIHJlcGVhdDtcbiAgICAgICAgdmFyIG5ld1BvcyA9IGFjdGlvbkFyZ3MuZm9yd2FyZCA/IHRvcCArIGRlbHRhIDogdG9wIC0gZGVsdGE7XG4gICAgICAgIHZhciBjdXJzb3IgPSBjb3B5Q3Vyc29yKGNtLmdldEN1cnNvcigpKTtcbiAgICAgICAgdmFyIGN1cnNvckNvb3JkcyA9IGNtLmNoYXJDb29yZHMoY3Vyc29yLCAnbG9jYWwnKTtcbiAgICAgICAgaWYgKGFjdGlvbkFyZ3MuZm9yd2FyZCkge1xuICAgICAgICAgIGlmIChuZXdQb3MgPiBjdXJzb3JDb29yZHMudG9wKSB7XG4gICAgICAgICAgICAgY3Vyc29yLmxpbmUgKz0gKG5ld1BvcyAtIGN1cnNvckNvb3Jkcy50b3ApIC8gbGluZUhlaWdodDtcbiAgICAgICAgICAgICBjdXJzb3IubGluZSA9IE1hdGguY2VpbChjdXJzb3IubGluZSk7XG4gICAgICAgICAgICAgY20uc2V0Q3Vyc29yKGN1cnNvcik7XG4gICAgICAgICAgICAgY3Vyc29yQ29vcmRzID0gY20uY2hhckNvb3JkcyhjdXJzb3IsICdsb2NhbCcpO1xuICAgICAgICAgICAgIGNtLnNjcm9sbFRvKG51bGwsIGN1cnNvckNvb3Jkcy50b3ApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgLy8gQ3Vyc29yIHN0YXlzIHdpdGhpbiBib3VuZHMuICBKdXN0IHJlcG9zaXRpb24gdGhlIHNjcm9sbCB3aW5kb3cuXG4gICAgICAgICAgICAgY20uc2Nyb2xsVG8obnVsbCwgbmV3UG9zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG5ld0JvdHRvbSA9IG5ld1BvcyArIGNtLmdldFNjcm9sbEluZm8oKS5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgaWYgKG5ld0JvdHRvbSA8IGN1cnNvckNvb3Jkcy5ib3R0b20pIHtcbiAgICAgICAgICAgICBjdXJzb3IubGluZSAtPSAoY3Vyc29yQ29vcmRzLmJvdHRvbSAtIG5ld0JvdHRvbSkgLyBsaW5lSGVpZ2h0O1xuICAgICAgICAgICAgIGN1cnNvci5saW5lID0gTWF0aC5mbG9vcihjdXJzb3IubGluZSk7XG4gICAgICAgICAgICAgY20uc2V0Q3Vyc29yKGN1cnNvcik7XG4gICAgICAgICAgICAgY3Vyc29yQ29vcmRzID0gY20uY2hhckNvb3JkcyhjdXJzb3IsICdsb2NhbCcpO1xuICAgICAgICAgICAgIGNtLnNjcm9sbFRvKFxuICAgICAgICAgICAgICAgICBudWxsLCBjdXJzb3JDb29yZHMuYm90dG9tIC0gY20uZ2V0U2Nyb2xsSW5mbygpLmNsaWVudEhlaWdodCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAvLyBDdXJzb3Igc3RheXMgd2l0aGluIGJvdW5kcy4gIEp1c3QgcmVwb3NpdGlvbiB0aGUgc2Nyb2xsIHdpbmRvdy5cbiAgICAgICAgICAgICBjbS5zY3JvbGxUbyhudWxsLCBuZXdQb3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNjcm9sbFRvQ3Vyc29yOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncykge1xuICAgICAgICB2YXIgbGluZU51bSA9IGNtLmdldEN1cnNvcigpLmxpbmU7XG4gICAgICAgIHZhciBjaGFyQ29vcmRzID0gY20uY2hhckNvb3JkcyhQb3MobGluZU51bSwgMCksICdsb2NhbCcpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gY20uZ2V0U2Nyb2xsSW5mbygpLmNsaWVudEhlaWdodDtcbiAgICAgICAgdmFyIHkgPSBjaGFyQ29vcmRzLnRvcDtcbiAgICAgICAgdmFyIGxpbmVIZWlnaHQgPSBjaGFyQ29vcmRzLmJvdHRvbSAtIHk7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uQXJncy5wb3NpdGlvbikge1xuICAgICAgICAgIGNhc2UgJ2NlbnRlcic6IHkgPSB5IC0gKGhlaWdodCAvIDIpICsgbGluZUhlaWdodDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6IHkgPSB5IC0gaGVpZ2h0ICsgbGluZUhlaWdodDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNtLnNjcm9sbFRvKG51bGwsIHkpO1xuICAgICAgfSxcbiAgICAgIHJlcGxheU1hY3JvOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciByZWdpc3Rlck5hbWUgPSBhY3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyO1xuICAgICAgICB2YXIgcmVwZWF0ID0gYWN0aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgICBpZiAocmVnaXN0ZXJOYW1lID09ICdAJykge1xuICAgICAgICAgIHJlZ2lzdGVyTmFtZSA9IG1hY3JvTW9kZVN0YXRlLmxhdGVzdFJlZ2lzdGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hY3JvTW9kZVN0YXRlLmxhdGVzdFJlZ2lzdGVyID0gcmVnaXN0ZXJOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlKHJlcGVhdC0tKXtcbiAgICAgICAgICBleGVjdXRlTWFjcm9SZWdpc3RlcihjbSwgdmltLCBtYWNyb01vZGVTdGF0ZSwgcmVnaXN0ZXJOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVudGVyTWFjcm9SZWNvcmRNb2RlOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncykge1xuICAgICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgICAgdmFyIHJlZ2lzdGVyTmFtZSA9IGFjdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgICAgIGlmICh2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIuaXNWYWxpZFJlZ2lzdGVyKHJlZ2lzdGVyTmFtZSkpIHtcbiAgICAgICAgICBtYWNyb01vZGVTdGF0ZS5lbnRlck1hY3JvUmVjb3JkTW9kZShjbSwgcmVnaXN0ZXJOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRvZ2dsZU92ZXJ3cml0ZTogZnVuY3Rpb24oY20pIHtcbiAgICAgICAgaWYgKCFjbS5zdGF0ZS5vdmVyd3JpdGUpIHtcbiAgICAgICAgICBjbS50b2dnbGVPdmVyd3JpdGUodHJ1ZSk7XG4gICAgICAgICAgY20uc2V0T3B0aW9uKCdrZXlNYXAnLCAndmltLXJlcGxhY2UnKTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwicmVwbGFjZVwifSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY20udG9nZ2xlT3ZlcndyaXRlKGZhbHNlKTtcbiAgICAgICAgICBjbS5zZXRPcHRpb24oJ2tleU1hcCcsICd2aW0taW5zZXJ0Jyk7XG4gICAgICAgICAgQ29kZU1pcnJvci5zaWduYWwoY20sIFwidmltLW1vZGUtY2hhbmdlXCIsIHttb2RlOiBcImluc2VydFwifSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlbnRlckluc2VydE1vZGU6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgaWYgKGNtLmdldE9wdGlvbigncmVhZE9ubHknKSkgeyByZXR1cm47IH1cbiAgICAgICAgdmltLmluc2VydE1vZGUgPSB0cnVlO1xuICAgICAgICB2aW0uaW5zZXJ0TW9kZVJlcGVhdCA9IGFjdGlvbkFyZ3MgJiYgYWN0aW9uQXJncy5yZXBlYXQgfHwgMTtcbiAgICAgICAgdmFyIGluc2VydEF0ID0gKGFjdGlvbkFyZ3MpID8gYWN0aW9uQXJncy5pbnNlcnRBdCA6IG51bGw7XG4gICAgICAgIHZhciBzZWwgPSB2aW0uc2VsO1xuICAgICAgICB2YXIgaGVhZCA9IGFjdGlvbkFyZ3MuaGVhZCB8fCBjbS5nZXRDdXJzb3IoJ2hlYWQnKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IGNtLmxpc3RTZWxlY3Rpb25zKCkubGVuZ3RoO1xuICAgICAgICBpZiAoaW5zZXJ0QXQgPT0gJ2VvbCcpIHtcbiAgICAgICAgICBoZWFkID0gUG9zKGhlYWQubGluZSwgbGluZUxlbmd0aChjbSwgaGVhZC5saW5lKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5zZXJ0QXQgPT0gJ2NoYXJBZnRlcicpIHtcbiAgICAgICAgICBoZWFkID0gb2Zmc2V0Q3Vyc29yKGhlYWQsIDAsIDEpO1xuICAgICAgICB9IGVsc2UgaWYgKGluc2VydEF0ID09ICdmaXJzdE5vbkJsYW5rJykge1xuICAgICAgICAgIGhlYWQgPSBtb3Rpb25zLm1vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbSwgaGVhZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5zZXJ0QXQgPT0gJ3N0YXJ0T2ZTZWxlY3RlZEFyZWEnKSB7XG4gICAgICAgICAgaWYgKCF2aW0udmlzdWFsTW9kZSlcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGlmICghdmltLnZpc3VhbEJsb2NrKSB7XG4gICAgICAgICAgICBpZiAoc2VsLmhlYWQubGluZSA8IHNlbC5hbmNob3IubGluZSkge1xuICAgICAgICAgICAgICBoZWFkID0gc2VsLmhlYWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBoZWFkID0gUG9zKHNlbC5hbmNob3IubGluZSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWQgPSBQb3MoXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc2VsLmhlYWQubGluZSwgc2VsLmFuY2hvci5saW5lKSxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzZWwuaGVhZC5jaCwgc2VsLmFuY2hvci5jaCkpO1xuICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5hYnMoc2VsLmhlYWQubGluZSAtIHNlbC5hbmNob3IubGluZSkgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpbnNlcnRBdCA9PSAnZW5kT2ZTZWxlY3RlZEFyZWEnKSB7XG4gICAgICAgICAgICBpZiAoIXZpbS52aXN1YWxNb2RlKVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgaWYgKCF2aW0udmlzdWFsQmxvY2spIHtcbiAgICAgICAgICAgIGlmIChzZWwuaGVhZC5saW5lID49IHNlbC5hbmNob3IubGluZSkge1xuICAgICAgICAgICAgICBoZWFkID0gb2Zmc2V0Q3Vyc29yKHNlbC5oZWFkLCAwLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGhlYWQgPSBQb3Moc2VsLmFuY2hvci5saW5lLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZCA9IFBvcyhcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzZWwuaGVhZC5saW5lLCBzZWwuYW5jaG9yLmxpbmUpLFxuICAgICAgICAgICAgICAgIE1hdGgubWF4KHNlbC5oZWFkLmNoICsgMSwgc2VsLmFuY2hvci5jaCkpO1xuICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5hYnMoc2VsLmhlYWQubGluZSAtIHNlbC5hbmNob3IubGluZSkgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpbnNlcnRBdCA9PSAnaW5wbGFjZScpIHtcbiAgICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjbS5zZXRPcHRpb24oJ2Rpc2FibGVJbnB1dCcsIGZhbHNlKTtcbiAgICAgICAgaWYgKGFjdGlvbkFyZ3MgJiYgYWN0aW9uQXJncy5yZXBsYWNlKSB7XG4gICAgICAgICAgLy8gSGFuZGxlIFJlcGxhY2UtbW9kZSBhcyBhIHNwZWNpYWwgY2FzZSBvZiBpbnNlcnQgbW9kZS5cbiAgICAgICAgICBjbS50b2dnbGVPdmVyd3JpdGUodHJ1ZSk7XG4gICAgICAgICAgY20uc2V0T3B0aW9uKCdrZXlNYXAnLCAndmltLXJlcGxhY2UnKTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwicmVwbGFjZVwifSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY20udG9nZ2xlT3ZlcndyaXRlKGZhbHNlKTtcbiAgICAgICAgICBjbS5zZXRPcHRpb24oJ2tleU1hcCcsICd2aW0taW5zZXJ0Jyk7XG4gICAgICAgICAgQ29kZU1pcnJvci5zaWduYWwoY20sIFwidmltLW1vZGUtY2hhbmdlXCIsIHttb2RlOiBcImluc2VydFwifSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAvLyBPbmx5IHJlY29yZCBpZiBub3QgcmVwbGF5aW5nLlxuICAgICAgICAgIGNtLm9uKCdjaGFuZ2UnLCBvbkNoYW5nZSk7XG4gICAgICAgICAgQ29kZU1pcnJvci5vbihjbS5nZXRJbnB1dEZpZWxkKCksICdrZXlkb3duJywgb25LZXlFdmVudFRhcmdldEtleURvd24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIGV4aXRWaXN1YWxNb2RlKGNtKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxlY3RGb3JJbnNlcnQoY20sIGhlYWQsIGhlaWdodCk7XG4gICAgICB9LFxuICAgICAgdG9nZ2xlVmlzdWFsTW9kZTogZnVuY3Rpb24oY20sIGFjdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2YXIgcmVwZWF0ID0gYWN0aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHZhciBhbmNob3IgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgdmFyIGhlYWQ7XG4gICAgICAgIC8vIFRPRE86IFRoZSByZXBlYXQgc2hvdWxkIGFjdHVhbGx5IHNlbGVjdCBudW1iZXIgb2YgY2hhcmFjdGVycy9saW5lc1xuICAgICAgICAvLyAgICAgZXF1YWwgdG8gdGhlIHJlcGVhdCB0aW1lcyB0aGUgc2l6ZSBvZiB0aGUgcHJldmlvdXMgdmlzdWFsXG4gICAgICAgIC8vICAgICBvcGVyYXRpb24uXG4gICAgICAgIGlmICghdmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAvLyBFbnRlcmluZyB2aXN1YWwgbW9kZVxuICAgICAgICAgIHZpbS52aXN1YWxNb2RlID0gdHJ1ZTtcbiAgICAgICAgICB2aW0udmlzdWFsTGluZSA9ICEhYWN0aW9uQXJncy5saW5ld2lzZTtcbiAgICAgICAgICB2aW0udmlzdWFsQmxvY2sgPSAhIWFjdGlvbkFyZ3MuYmxvY2t3aXNlO1xuICAgICAgICAgIGhlYWQgPSBjbGlwQ3Vyc29yVG9Db250ZW50KFxuICAgICAgICAgICAgICBjbSwgUG9zKGFuY2hvci5saW5lLCBhbmNob3IuY2ggKyByZXBlYXQgLSAxKSxcbiAgICAgICAgICAgICAgdHJ1ZSAvKiogaW5jbHVkZUxpbmVCcmVhayAqLyk7XG4gICAgICAgICAgdmltLnNlbCA9IHtcbiAgICAgICAgICAgIGFuY2hvcjogYW5jaG9yLFxuICAgICAgICAgICAgaGVhZDogaGVhZFxuICAgICAgICAgIH07XG4gICAgICAgICAgQ29kZU1pcnJvci5zaWduYWwoY20sIFwidmltLW1vZGUtY2hhbmdlXCIsIHttb2RlOiBcInZpc3VhbFwiLCBzdWJNb2RlOiB2aW0udmlzdWFsTGluZSA/IFwibGluZXdpc2VcIiA6IHZpbS52aXN1YWxCbG9jayA/IFwiYmxvY2t3aXNlXCIgOiBcIlwifSk7XG4gICAgICAgICAgdXBkYXRlQ21TZWxlY3Rpb24oY20pO1xuICAgICAgICAgIHVwZGF0ZU1hcmsoY20sIHZpbSwgJzwnLCBjdXJzb3JNaW4oYW5jaG9yLCBoZWFkKSk7XG4gICAgICAgICAgdXBkYXRlTWFyayhjbSwgdmltLCAnPicsIGN1cnNvck1heChhbmNob3IsIGhlYWQpKTtcbiAgICAgICAgfSBlbHNlIGlmICh2aW0udmlzdWFsTGluZSBeIGFjdGlvbkFyZ3MubGluZXdpc2UgfHxcbiAgICAgICAgICAgIHZpbS52aXN1YWxCbG9jayBeIGFjdGlvbkFyZ3MuYmxvY2t3aXNlKSB7XG4gICAgICAgICAgLy8gVG9nZ2xpbmcgYmV0d2VlbiBtb2Rlc1xuICAgICAgICAgIHZpbS52aXN1YWxMaW5lID0gISFhY3Rpb25BcmdzLmxpbmV3aXNlO1xuICAgICAgICAgIHZpbS52aXN1YWxCbG9jayA9ICEhYWN0aW9uQXJncy5ibG9ja3dpc2U7XG4gICAgICAgICAgQ29kZU1pcnJvci5zaWduYWwoY20sIFwidmltLW1vZGUtY2hhbmdlXCIsIHttb2RlOiBcInZpc3VhbFwiLCBzdWJNb2RlOiB2aW0udmlzdWFsTGluZSA/IFwibGluZXdpc2VcIiA6IHZpbS52aXN1YWxCbG9jayA/IFwiYmxvY2t3aXNlXCIgOiBcIlwifSk7XG4gICAgICAgICAgdXBkYXRlQ21TZWxlY3Rpb24oY20pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4aXRWaXN1YWxNb2RlKGNtKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJlc2VsZWN0TGFzdFNlbGVjdGlvbjogZnVuY3Rpb24oY20sIF9hY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIGxhc3RTZWxlY3Rpb24gPSB2aW0ubGFzdFNlbGVjdGlvbjtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgdXBkYXRlTGFzdFNlbGVjdGlvbihjbSwgdmltKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGFzdFNlbGVjdGlvbikge1xuICAgICAgICAgIHZhciBhbmNob3IgPSBsYXN0U2VsZWN0aW9uLmFuY2hvck1hcmsuZmluZCgpO1xuICAgICAgICAgIHZhciBoZWFkID0gbGFzdFNlbGVjdGlvbi5oZWFkTWFyay5maW5kKCk7XG4gICAgICAgICAgaWYgKCFhbmNob3IgfHwgIWhlYWQpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBtYXJrcyBoYXZlIGJlZW4gZGVzdHJveWVkIGR1ZSB0byBlZGl0cywgZG8gbm90aGluZy5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmltLnNlbCA9IHtcbiAgICAgICAgICAgIGFuY2hvcjogYW5jaG9yLFxuICAgICAgICAgICAgaGVhZDogaGVhZFxuICAgICAgICAgIH07XG4gICAgICAgICAgdmltLnZpc3VhbE1vZGUgPSB0cnVlO1xuICAgICAgICAgIHZpbS52aXN1YWxMaW5lID0gbGFzdFNlbGVjdGlvbi52aXN1YWxMaW5lO1xuICAgICAgICAgIHZpbS52aXN1YWxCbG9jayA9IGxhc3RTZWxlY3Rpb24udmlzdWFsQmxvY2s7XG4gICAgICAgICAgdXBkYXRlQ21TZWxlY3Rpb24oY20pO1xuICAgICAgICAgIHVwZGF0ZU1hcmsoY20sIHZpbSwgJzwnLCBjdXJzb3JNaW4oYW5jaG9yLCBoZWFkKSk7XG4gICAgICAgICAgdXBkYXRlTWFyayhjbSwgdmltLCAnPicsIGN1cnNvck1heChhbmNob3IsIGhlYWQpKTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgJ3ZpbS1tb2RlLWNoYW5nZScsIHtcbiAgICAgICAgICAgIG1vZGU6ICd2aXN1YWwnLFxuICAgICAgICAgICAgc3ViTW9kZTogdmltLnZpc3VhbExpbmUgPyAnbGluZXdpc2UnIDpcbiAgICAgICAgICAgICAgICAgICAgIHZpbS52aXN1YWxCbG9jayA/ICdibG9ja3dpc2UnIDogJyd9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGpvaW5MaW5lczogZnVuY3Rpb24oY20sIGFjdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2YXIgY3VyU3RhcnQsIGN1ckVuZDtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgY3VyU3RhcnQgPSBjbS5nZXRDdXJzb3IoJ2FuY2hvcicpO1xuICAgICAgICAgIGN1ckVuZCA9IGNtLmdldEN1cnNvcignaGVhZCcpO1xuICAgICAgICAgIGlmIChjdXJzb3JJc0JlZm9yZShjdXJFbmQsIGN1clN0YXJ0KSkge1xuICAgICAgICAgICAgdmFyIHRtcCA9IGN1ckVuZDtcbiAgICAgICAgICAgIGN1ckVuZCA9IGN1clN0YXJ0O1xuICAgICAgICAgICAgY3VyU3RhcnQgPSB0bXA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1ckVuZC5jaCA9IGxpbmVMZW5ndGgoY20sIGN1ckVuZC5saW5lKSAtIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmVwZWF0IGlzIHRoZSBudW1iZXIgb2YgbGluZXMgdG8gam9pbi4gTWluaW11bSAyIGxpbmVzLlxuICAgICAgICAgIHZhciByZXBlYXQgPSBNYXRoLm1heChhY3Rpb25BcmdzLnJlcGVhdCwgMik7XG4gICAgICAgICAgY3VyU3RhcnQgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgICBjdXJFbmQgPSBjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCBQb3MoY3VyU3RhcnQubGluZSArIHJlcGVhdCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluZmluaXR5KSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZpbmFsQ2ggPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gY3VyU3RhcnQubGluZTsgaSA8IGN1ckVuZC5saW5lOyBpKyspIHtcbiAgICAgICAgICBmaW5hbENoID0gbGluZUxlbmd0aChjbSwgY3VyU3RhcnQubGluZSk7XG4gICAgICAgICAgdmFyIHRtcCA9IFBvcyhjdXJTdGFydC5saW5lICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVMZW5ndGgoY20sIGN1clN0YXJ0LmxpbmUgKyAxKSk7XG4gICAgICAgICAgdmFyIHRleHQgPSBjbS5nZXRSYW5nZShjdXJTdGFydCwgdG1wKTtcbiAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXG5cXHMqL2csICcgJyk7XG4gICAgICAgICAgY20ucmVwbGFjZVJhbmdlKHRleHQsIGN1clN0YXJ0LCB0bXApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdXJGaW5hbFBvcyA9IFBvcyhjdXJTdGFydC5saW5lLCBmaW5hbENoKTtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBjbS5zZXRDdXJzb3IoY3VyRmluYWxQb3MpO1xuICAgICAgfSxcbiAgICAgIG5ld0xpbmVBbmRFbnRlckluc2VydE1vZGU6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmltLmluc2VydE1vZGUgPSB0cnVlO1xuICAgICAgICB2YXIgaW5zZXJ0QXQgPSBjb3B5Q3Vyc29yKGNtLmdldEN1cnNvcigpKTtcbiAgICAgICAgaWYgKGluc2VydEF0LmxpbmUgPT09IGNtLmZpcnN0TGluZSgpICYmICFhY3Rpb25BcmdzLmFmdGVyKSB7XG4gICAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBpbnNlcnRpbmcgbmV3bGluZSBiZWZvcmUgc3RhcnQgb2YgZG9jdW1lbnQuXG4gICAgICAgICAgY20ucmVwbGFjZVJhbmdlKCdcXG4nLCBQb3MoY20uZmlyc3RMaW5lKCksIDApKTtcbiAgICAgICAgICBjbS5zZXRDdXJzb3IoY20uZmlyc3RMaW5lKCksIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluc2VydEF0LmxpbmUgPSAoYWN0aW9uQXJncy5hZnRlcikgPyBpbnNlcnRBdC5saW5lIDpcbiAgICAgICAgICAgICAgaW5zZXJ0QXQubGluZSAtIDE7XG4gICAgICAgICAgaW5zZXJ0QXQuY2ggPSBsaW5lTGVuZ3RoKGNtLCBpbnNlcnRBdC5saW5lKTtcbiAgICAgICAgICBjbS5zZXRDdXJzb3IoaW5zZXJ0QXQpO1xuICAgICAgICAgIHZhciBuZXdsaW5lRm4gPSBDb2RlTWlycm9yLmNvbW1hbmRzLm5ld2xpbmVBbmRJbmRlbnRDb250aW51ZUNvbW1lbnQgfHxcbiAgICAgICAgICAgICAgQ29kZU1pcnJvci5jb21tYW5kcy5uZXdsaW5lQW5kSW5kZW50O1xuICAgICAgICAgIG5ld2xpbmVGbihjbSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbnRlckluc2VydE1vZGUoY20sIHsgcmVwZWF0OiBhY3Rpb25BcmdzLnJlcGVhdCB9LCB2aW0pO1xuICAgICAgfSxcbiAgICAgIHBhc3RlOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBjdXIgPSBjb3B5Q3Vyc29yKGNtLmdldEN1cnNvcigpKTtcbiAgICAgICAgdmFyIHJlZ2lzdGVyID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmdldFJlZ2lzdGVyKFxuICAgICAgICAgICAgYWN0aW9uQXJncy5yZWdpc3Rlck5hbWUpO1xuICAgICAgICB2YXIgdGV4dCA9IHJlZ2lzdGVyLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICghdGV4dCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uQXJncy5tYXRjaEluZGVudCkge1xuICAgICAgICAgIHZhciB0YWJTaXplID0gY20uZ2V0T3B0aW9uKFwidGFiU2l6ZVwiKTtcbiAgICAgICAgICAvLyBsZW5ndGggdGhhdCBjb25zaWRlcnMgdGFicyBhbmQgdGFiU2l6ZVxuICAgICAgICAgIHZhciB3aGl0ZXNwYWNlTGVuZ3RoID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICB2YXIgdGFicyA9IChzdHIuc3BsaXQoXCJcXHRcIikubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB2YXIgc3BhY2VzID0gKHN0ci5zcGxpdChcIiBcIikubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICByZXR1cm4gdGFicyAqIHRhYlNpemUgKyBzcGFjZXMgKiAxO1xuICAgICAgICAgIH07XG4gICAgICAgICAgdmFyIGN1cnJlbnRMaW5lID0gY20uZ2V0TGluZShjbS5nZXRDdXJzb3IoKS5saW5lKTtcbiAgICAgICAgICB2YXIgaW5kZW50ID0gd2hpdGVzcGFjZUxlbmd0aChjdXJyZW50TGluZS5tYXRjaCgvXlxccyovKVswXSk7XG4gICAgICAgICAgLy8gY2hvbXAgbGFzdCBuZXdsaW5lIGIvYyBkb24ndCB3YW50IGl0IHRvIG1hdGNoIC9eXFxzKi9nbVxuICAgICAgICAgIHZhciBjaG9tcGVkVGV4dCA9IHRleHQucmVwbGFjZSgvXFxuJC8sICcnKTtcbiAgICAgICAgICB2YXIgd2FzQ2hvbXBlZCA9IHRleHQgIT09IGNob21wZWRUZXh0O1xuICAgICAgICAgIHZhciBmaXJzdEluZGVudCA9IHdoaXRlc3BhY2VMZW5ndGgodGV4dC5tYXRjaCgvXlxccyovKVswXSk7XG4gICAgICAgICAgdmFyIHRleHQgPSBjaG9tcGVkVGV4dC5yZXBsYWNlKC9eXFxzKi9nbSwgZnVuY3Rpb24od3NwYWNlKSB7XG4gICAgICAgICAgICB2YXIgbmV3SW5kZW50ID0gaW5kZW50ICsgKHdoaXRlc3BhY2VMZW5ndGgod3NwYWNlKSAtIGZpcnN0SW5kZW50KTtcbiAgICAgICAgICAgIGlmIChuZXdJbmRlbnQgPCAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY20uZ2V0T3B0aW9uKFwiaW5kZW50V2l0aFRhYnNcIikpIHtcbiAgICAgICAgICAgICAgdmFyIHF1b3RpZW50ID0gTWF0aC5mbG9vcihuZXdJbmRlbnQgLyB0YWJTaXplKTtcbiAgICAgICAgICAgICAgcmV0dXJuIEFycmF5KHF1b3RpZW50ICsgMSkuam9pbignXFx0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIEFycmF5KG5ld0luZGVudCArIDEpLmpvaW4oJyAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0ZXh0ICs9IHdhc0Nob21wZWQgPyBcIlxcblwiIDogXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uQXJncy5yZXBlYXQgPiAxKSB7XG4gICAgICAgICAgdmFyIHRleHQgPSBBcnJheShhY3Rpb25BcmdzLnJlcGVhdCArIDEpLmpvaW4odGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxpbmV3aXNlID0gcmVnaXN0ZXIubGluZXdpc2U7XG4gICAgICAgIHZhciBibG9ja3dpc2UgPSByZWdpc3Rlci5ibG9ja3dpc2U7XG4gICAgICAgIGlmIChibG9ja3dpc2UpIHtcbiAgICAgICAgICB0ZXh0ID0gdGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgaWYgKGxpbmV3aXNlKSB7XG4gICAgICAgICAgICAgIHRleHQucG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGV4dFtpXSA9ICh0ZXh0W2ldID09ICcnKSA/ICcgJyA6IHRleHRbaV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1ci5jaCArPSBhY3Rpb25BcmdzLmFmdGVyID8gMSA6IDA7XG4gICAgICAgICAgY3VyLmNoID0gTWF0aC5taW4obGluZUxlbmd0aChjbSwgY3VyLmxpbmUpLCBjdXIuY2gpO1xuICAgICAgICB9IGVsc2UgaWYgKGxpbmV3aXNlKSB7XG4gICAgICAgICAgaWYodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAgIHRleHQgPSB2aW0udmlzdWFsTGluZSA/IHRleHQuc2xpY2UoMCwgLTEpIDogJ1xcbicgKyB0ZXh0LnNsaWNlKDAsIHRleHQubGVuZ3RoIC0gMSkgKyAnXFxuJztcbiAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbkFyZ3MuYWZ0ZXIpIHtcbiAgICAgICAgICAgIC8vIE1vdmUgdGhlIG5ld2xpbmUgYXQgdGhlIGVuZCB0byB0aGUgc3RhcnQgaW5zdGVhZCwgYW5kIHBhc3RlIGp1c3RcbiAgICAgICAgICAgIC8vIGJlZm9yZSB0aGUgbmV3bGluZSBjaGFyYWN0ZXIgb2YgdGhlIGxpbmUgd2UgYXJlIG9uIHJpZ2h0IG5vdy5cbiAgICAgICAgICAgIHRleHQgPSAnXFxuJyArIHRleHQuc2xpY2UoMCwgdGV4dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIGN1ci5jaCA9IGxpbmVMZW5ndGgoY20sIGN1ci5saW5lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VyLmNoID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VyLmNoICs9IGFjdGlvbkFyZ3MuYWZ0ZXIgPyAxIDogMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY3VyUG9zRmluYWw7XG4gICAgICAgIHZhciBpZHg7XG4gICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIC8vICBzYXZlIHRoZSBwYXN0ZWQgdGV4dCBmb3IgcmVzZWxlY3Rpb24gaWYgdGhlIG5lZWQgYXJpc2VzXG4gICAgICAgICAgdmltLmxhc3RQYXN0ZWRUZXh0ID0gdGV4dDtcbiAgICAgICAgICB2YXIgbGFzdFNlbGVjdGlvbkN1ckVuZDtcbiAgICAgICAgICB2YXIgc2VsZWN0ZWRBcmVhID0gZ2V0U2VsZWN0ZWRBcmVhUmFuZ2UoY20sIHZpbSk7XG4gICAgICAgICAgdmFyIHNlbGVjdGlvblN0YXJ0ID0gc2VsZWN0ZWRBcmVhWzBdO1xuICAgICAgICAgIHZhciBzZWxlY3Rpb25FbmQgPSBzZWxlY3RlZEFyZWFbMV07XG4gICAgICAgICAgdmFyIHNlbGVjdGVkVGV4dCA9IGNtLmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgIHZhciBzZWxlY3Rpb25zID0gY20ubGlzdFNlbGVjdGlvbnMoKTtcbiAgICAgICAgICB2YXIgZW1wdHlTdHJpbmdzID0gbmV3IEFycmF5KHNlbGVjdGlvbnMubGVuZ3RoKS5qb2luKCcxJykuc3BsaXQoJzEnKTtcbiAgICAgICAgICAvLyBzYXZlIHRoZSBjdXJFbmQgbWFya2VyIGJlZm9yZSBpdCBnZXQgY2xlYXJlZCBkdWUgdG8gY20ucmVwbGFjZVJhbmdlLlxuICAgICAgICAgIGlmICh2aW0ubGFzdFNlbGVjdGlvbikge1xuICAgICAgICAgICAgbGFzdFNlbGVjdGlvbkN1ckVuZCA9IHZpbS5sYXN0U2VsZWN0aW9uLmhlYWRNYXJrLmZpbmQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gcHVzaCB0aGUgcHJldmlvdXNseSBzZWxlY3RlZCB0ZXh0IHRvIHVubmFtZWQgcmVnaXN0ZXJcbiAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIudW5uYW1lZFJlZ2lzdGVyLnNldFRleHQoc2VsZWN0ZWRUZXh0KTtcbiAgICAgICAgICBpZiAoYmxvY2t3aXNlKSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBkZWxldGUgdGhlIHNlbGVjdGVkIHRleHRcbiAgICAgICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb25zKGVtcHR5U3RyaW5ncyk7XG4gICAgICAgICAgICAvLyBTZXQgbmV3IHNlbGVjdGlvbnMgYXMgcGVyIHRoZSBibG9jayBsZW5ndGggb2YgdGhlIHlhbmtlZCB0ZXh0XG4gICAgICAgICAgICBzZWxlY3Rpb25FbmQgPSBQb3Moc2VsZWN0aW9uU3RhcnQubGluZSArIHRleHQubGVuZ3RoLTEsIHNlbGVjdGlvblN0YXJ0LmNoKTtcbiAgICAgICAgICAgIGNtLnNldEN1cnNvcihzZWxlY3Rpb25TdGFydCk7XG4gICAgICAgICAgICBzZWxlY3RCbG9jayhjbSwgc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb25zKHRleHQpO1xuICAgICAgICAgICAgY3VyUG9zRmluYWwgPSBzZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICB9IGVsc2UgaWYgKHZpbS52aXN1YWxCbG9jaykge1xuICAgICAgICAgICAgY20ucmVwbGFjZVNlbGVjdGlvbnMoZW1wdHlTdHJpbmdzKTtcbiAgICAgICAgICAgIGNtLnNldEN1cnNvcihzZWxlY3Rpb25TdGFydCk7XG4gICAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UodGV4dCwgc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgIGN1clBvc0ZpbmFsID0gc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSh0ZXh0LCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgICAgIGN1clBvc0ZpbmFsID0gY20ucG9zRnJvbUluZGV4KGNtLmluZGV4RnJvbVBvcyhzZWxlY3Rpb25TdGFydCkgKyB0ZXh0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyByZXN0b3JlIHRoZSB0aGUgY3VyRW5kIG1hcmtlclxuICAgICAgICAgIGlmKGxhc3RTZWxlY3Rpb25DdXJFbmQpIHtcbiAgICAgICAgICAgIHZpbS5sYXN0U2VsZWN0aW9uLmhlYWRNYXJrID0gY20uc2V0Qm9va21hcmsobGFzdFNlbGVjdGlvbkN1ckVuZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChsaW5ld2lzZSkge1xuICAgICAgICAgICAgY3VyUG9zRmluYWwuY2g9MDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGJsb2Nrd2lzZSkge1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKGN1cik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIGxpbmUgPSBjdXIubGluZStpO1xuICAgICAgICAgICAgICBpZiAobGluZSA+IGNtLmxhc3RMaW5lKCkpIHtcbiAgICAgICAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UoJ1xcbicsICBQb3MobGluZSwgMCkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhciBsYXN0Q2ggPSBsaW5lTGVuZ3RoKGNtLCBsaW5lKTtcbiAgICAgICAgICAgICAgaWYgKGxhc3RDaCA8IGN1ci5jaCkge1xuICAgICAgICAgICAgICAgIGV4dGVuZExpbmVUb0NvbHVtbihjbSwgbGluZSwgY3VyLmNoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKGN1cik7XG4gICAgICAgICAgICBzZWxlY3RCbG9jayhjbSwgUG9zKGN1ci5saW5lICsgdGV4dC5sZW5ndGgtMSwgY3VyLmNoKSk7XG4gICAgICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9ucyh0ZXh0KTtcbiAgICAgICAgICAgIGN1clBvc0ZpbmFsID0gY3VyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UodGV4dCwgY3VyKTtcbiAgICAgICAgICAgIC8vIE5vdyBmaW5lIHR1bmUgdGhlIGN1cnNvciB0byB3aGVyZSB3ZSB3YW50IGl0LlxuICAgICAgICAgICAgaWYgKGxpbmV3aXNlICYmIGFjdGlvbkFyZ3MuYWZ0ZXIpIHtcbiAgICAgICAgICAgICAgY3VyUG9zRmluYWwgPSBQb3MoXG4gICAgICAgICAgICAgIGN1ci5saW5lICsgMSxcbiAgICAgICAgICAgICAgZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGN1ci5saW5lICsgMSkpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGluZXdpc2UgJiYgIWFjdGlvbkFyZ3MuYWZ0ZXIpIHtcbiAgICAgICAgICAgICAgY3VyUG9zRmluYWwgPSBQb3MoXG4gICAgICAgICAgICAgICAgY3VyLmxpbmUsXG4gICAgICAgICAgICAgICAgZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGN1ci5saW5lKSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghbGluZXdpc2UgJiYgYWN0aW9uQXJncy5hZnRlcikge1xuICAgICAgICAgICAgICBpZHggPSBjbS5pbmRleEZyb21Qb3MoY3VyKTtcbiAgICAgICAgICAgICAgY3VyUG9zRmluYWwgPSBjbS5wb3NGcm9tSW5kZXgoaWR4ICsgdGV4dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlkeCA9IGNtLmluZGV4RnJvbVBvcyhjdXIpO1xuICAgICAgICAgICAgICBjdXJQb3NGaW5hbCA9IGNtLnBvc0Zyb21JbmRleChpZHggKyB0ZXh0Lmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIGV4aXRWaXN1YWxNb2RlKGNtLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgY20uc2V0Q3Vyc29yKGN1clBvc0ZpbmFsKTtcbiAgICAgIH0sXG4gICAgICB1bmRvOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncykge1xuICAgICAgICBjbS5vcGVyYXRpb24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVwZWF0Rm4oY20sIENvZGVNaXJyb3IuY29tbWFuZHMudW5kbywgYWN0aW9uQXJncy5yZXBlYXQpKCk7XG4gICAgICAgICAgY20uc2V0Q3Vyc29yKGNtLmdldEN1cnNvcignYW5jaG9yJykpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICByZWRvOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncykge1xuICAgICAgICByZXBlYXRGbihjbSwgQ29kZU1pcnJvci5jb21tYW5kcy5yZWRvLCBhY3Rpb25BcmdzLnJlcGVhdCkoKTtcbiAgICAgIH0sXG4gICAgICBzZXRSZWdpc3RlcjogZnVuY3Rpb24oX2NtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmltLmlucHV0U3RhdGUucmVnaXN0ZXJOYW1lID0gYWN0aW9uQXJncy5zZWxlY3RlZENoYXJhY3RlcjtcbiAgICAgIH0sXG4gICAgICBzZXRNYXJrOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBtYXJrTmFtZSA9IGFjdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgICAgIHVwZGF0ZU1hcmsoY20sIHZpbSwgbWFya05hbWUsIGNtLmdldEN1cnNvcigpKTtcbiAgICAgIH0sXG4gICAgICByZXBsYWNlOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciByZXBsYWNlV2l0aCA9IGFjdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgICAgIHZhciBjdXJTdGFydCA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICB2YXIgcmVwbGFjZVRvO1xuICAgICAgICB2YXIgY3VyRW5kO1xuICAgICAgICB2YXIgc2VsZWN0aW9ucyA9IGNtLmxpc3RTZWxlY3Rpb25zKCk7XG4gICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIGN1clN0YXJ0ID0gY20uZ2V0Q3Vyc29yKCdzdGFydCcpO1xuICAgICAgICAgIGN1ckVuZCA9IGNtLmdldEN1cnNvcignZW5kJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGN1clN0YXJ0LmxpbmUpO1xuICAgICAgICAgIHJlcGxhY2VUbyA9IGN1clN0YXJ0LmNoICsgYWN0aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgICAgaWYgKHJlcGxhY2VUbyA+IGxpbmUubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXBsYWNlVG89bGluZS5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1ckVuZCA9IFBvcyhjdXJTdGFydC5saW5lLCByZXBsYWNlVG8pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXBsYWNlV2l0aD09J1xcbicpIHtcbiAgICAgICAgICBpZiAoIXZpbS52aXN1YWxNb2RlKSBjbS5yZXBsYWNlUmFuZ2UoJycsIGN1clN0YXJ0LCBjdXJFbmQpO1xuICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZSwgd2hlcmUgdmltIGhlbHAgc2F5cyB0byByZXBsYWNlIGJ5IGp1c3Qgb25lIGxpbmUtYnJlYWtcbiAgICAgICAgICAoQ29kZU1pcnJvci5jb21tYW5kcy5uZXdsaW5lQW5kSW5kZW50Q29udGludWVDb21tZW50IHx8IENvZGVNaXJyb3IuY29tbWFuZHMubmV3bGluZUFuZEluZGVudCkoY20pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciByZXBsYWNlV2l0aFN0ciA9IGNtLmdldFJhbmdlKGN1clN0YXJ0LCBjdXJFbmQpO1xuICAgICAgICAgIC8vcmVwbGFjZSBhbGwgY2hhcmFjdGVycyBpbiByYW5nZSBieSBzZWxlY3RlZCwgYnV0IGtlZXAgbGluZWJyZWFrc1xuICAgICAgICAgIHJlcGxhY2VXaXRoU3RyID0gcmVwbGFjZVdpdGhTdHIucmVwbGFjZSgvW15cXG5dL2csIHJlcGxhY2VXaXRoKTtcbiAgICAgICAgICBpZiAodmltLnZpc3VhbEJsb2NrKSB7XG4gICAgICAgICAgICAvLyBUYWJzIGFyZSBzcGxpdCBpbiB2aXN1YSBibG9jayBiZWZvcmUgcmVwbGFjaW5nXG4gICAgICAgICAgICB2YXIgc3BhY2VzID0gbmV3IEFycmF5KGNtLmdldE9wdGlvbihcInRhYlNpemVcIikrMSkuam9pbignICcpO1xuICAgICAgICAgICAgcmVwbGFjZVdpdGhTdHIgPSBjbS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIHJlcGxhY2VXaXRoU3RyID0gcmVwbGFjZVdpdGhTdHIucmVwbGFjZSgvXFx0L2csIHNwYWNlcykucmVwbGFjZSgvW15cXG5dL2csIHJlcGxhY2VXaXRoKS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9ucyhyZXBsYWNlV2l0aFN0cik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZShyZXBsYWNlV2l0aFN0ciwgY3VyU3RhcnQsIGN1ckVuZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgICAgY3VyU3RhcnQgPSBjdXJzb3JJc0JlZm9yZShzZWxlY3Rpb25zWzBdLmFuY2hvciwgc2VsZWN0aW9uc1swXS5oZWFkKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uc1swXS5hbmNob3IgOiBzZWxlY3Rpb25zWzBdLmhlYWQ7XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3IoY3VyU3RhcnQpO1xuICAgICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20sIGZhbHNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKG9mZnNldEN1cnNvcihjdXJFbmQsIDAsIC0xKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaW5jcmVtZW50TnVtYmVyVG9rZW46IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBjdXIgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgdmFyIGxpbmVTdHIgPSBjbS5nZXRMaW5lKGN1ci5saW5lKTtcbiAgICAgICAgdmFyIHJlID0gLygtPykoPzooMHgpKFtcXGRhLWZdKyl8KDBifDB8KShcXGQrKSkvZ2k7XG4gICAgICAgIHZhciBtYXRjaDtcbiAgICAgICAgdmFyIHN0YXJ0O1xuICAgICAgICB2YXIgZW5kO1xuICAgICAgICB2YXIgbnVtYmVyU3RyO1xuICAgICAgICB3aGlsZSAoKG1hdGNoID0gcmUuZXhlYyhsaW5lU3RyKSkgIT09IG51bGwpIHtcbiAgICAgICAgICBzdGFydCA9IG1hdGNoLmluZGV4O1xuICAgICAgICAgIGVuZCA9IHN0YXJ0ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgIGlmIChjdXIuY2ggPCBlbmQpYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhY3Rpb25BcmdzLmJhY2t0cmFjayAmJiAoZW5kIDw9IGN1ci5jaCkpcmV0dXJuO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICB2YXIgYmFzZVN0ciA9IG1hdGNoWzJdIHx8IG1hdGNoWzRdXG4gICAgICAgICAgdmFyIGRpZ2l0cyA9IG1hdGNoWzNdIHx8IG1hdGNoWzVdXG4gICAgICAgICAgdmFyIGluY3JlbWVudCA9IGFjdGlvbkFyZ3MuaW5jcmVhc2UgPyAxIDogLTE7XG4gICAgICAgICAgdmFyIGJhc2UgPSB7JzBiJzogMiwgJzAnOiA4LCAnJzogMTAsICcweCc6IDE2fVtiYXNlU3RyLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICAgIHZhciBudW1iZXIgPSBwYXJzZUludChtYXRjaFsxXSArIGRpZ2l0cywgYmFzZSkgKyAoaW5jcmVtZW50ICogYWN0aW9uQXJncy5yZXBlYXQpO1xuICAgICAgICAgIG51bWJlclN0ciA9IG51bWJlci50b1N0cmluZyhiYXNlKTtcbiAgICAgICAgICB2YXIgemVyb1BhZGRpbmcgPSBiYXNlU3RyID8gbmV3IEFycmF5KGRpZ2l0cy5sZW5ndGggLSBudW1iZXJTdHIubGVuZ3RoICsgMSArIG1hdGNoWzFdLmxlbmd0aCkuam9pbignMCcpIDogJydcbiAgICAgICAgICBpZiAobnVtYmVyU3RyLmNoYXJBdCgwKSA9PT0gJy0nKSB7XG4gICAgICAgICAgICBudW1iZXJTdHIgPSAnLScgKyBiYXNlU3RyICsgemVyb1BhZGRpbmcgKyBudW1iZXJTdHIuc3Vic3RyKDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBudW1iZXJTdHIgPSBiYXNlU3RyICsgemVyb1BhZGRpbmcgKyBudW1iZXJTdHI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBmcm9tID0gUG9zKGN1ci5saW5lLCBzdGFydCk7XG4gICAgICAgICAgdmFyIHRvID0gUG9zKGN1ci5saW5lLCBlbmQpO1xuICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZShudW1iZXJTdHIsIGZyb20sIHRvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY20uc2V0Q3Vyc29yKFBvcyhjdXIubGluZSwgc3RhcnQgKyBudW1iZXJTdHIubGVuZ3RoIC0gMSkpO1xuICAgICAgfSxcbiAgICAgIHJlcGVhdExhc3RFZGl0OiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBsYXN0RWRpdElucHV0U3RhdGUgPSB2aW0ubGFzdEVkaXRJbnB1dFN0YXRlO1xuICAgICAgICBpZiAoIWxhc3RFZGl0SW5wdXRTdGF0ZSkgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIHJlcGVhdCA9IGFjdGlvbkFyZ3MucmVwZWF0O1xuICAgICAgICBpZiAocmVwZWF0ICYmIGFjdGlvbkFyZ3MucmVwZWF0SXNFeHBsaWNpdCkge1xuICAgICAgICAgIHZpbS5sYXN0RWRpdElucHV0U3RhdGUucmVwZWF0T3ZlcnJpZGUgPSByZXBlYXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVwZWF0ID0gdmltLmxhc3RFZGl0SW5wdXRTdGF0ZS5yZXBlYXRPdmVycmlkZSB8fCByZXBlYXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmVwZWF0TGFzdEVkaXQoY20sIHZpbSwgcmVwZWF0LCBmYWxzZSAvKiogcmVwZWF0Rm9ySW5zZXJ0ICovKTtcbiAgICAgIH0sXG4gICAgICBpbmRlbnQ6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzKSB7XG4gICAgICAgIGNtLmluZGVudExpbmUoY20uZ2V0Q3Vyc29yKCkubGluZSwgYWN0aW9uQXJncy5pbmRlbnRSaWdodCk7XG4gICAgICB9LFxuICAgICAgZXhpdEluc2VydE1vZGU6IGV4aXRJbnNlcnRNb2RlXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGRlZmluZUFjdGlvbihuYW1lLCBmbikge1xuICAgICAgYWN0aW9uc1tuYW1lXSA9IGZuO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogQmVsb3cgYXJlIG1pc2NlbGxhbmVvdXMgdXRpbGl0eSBmdW5jdGlvbnMgdXNlZCBieSB2aW0uanNcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIENsaXBzIGN1cnNvciB0byBlbnN1cmUgdGhhdCBsaW5lIGlzIHdpdGhpbiB0aGUgYnVmZmVyJ3MgcmFuZ2VcbiAgICAgKiBJZiBpbmNsdWRlTGluZUJyZWFrIGlzIHRydWUsIHRoZW4gYWxsb3cgY3VyLmNoID09IGxpbmVMZW5ndGguXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xpcEN1cnNvclRvQ29udGVudChjbSwgY3VyLCBpbmNsdWRlTGluZUJyZWFrKSB7XG4gICAgICB2YXIgbGluZSA9IE1hdGgubWluKE1hdGgubWF4KGNtLmZpcnN0TGluZSgpLCBjdXIubGluZSksIGNtLmxhc3RMaW5lKCkgKTtcbiAgICAgIHZhciBtYXhDaCA9IGxpbmVMZW5ndGgoY20sIGxpbmUpIC0gMTtcbiAgICAgIG1heENoID0gKGluY2x1ZGVMaW5lQnJlYWspID8gbWF4Q2ggKyAxIDogbWF4Q2g7XG4gICAgICB2YXIgY2ggPSBNYXRoLm1pbihNYXRoLm1heCgwLCBjdXIuY2gpLCBtYXhDaCk7XG4gICAgICByZXR1cm4gUG9zKGxpbmUsIGNoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29weUFyZ3MoYXJncykge1xuICAgICAgdmFyIHJldCA9IHt9O1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBhcmdzKSB7XG4gICAgICAgIGlmIChhcmdzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgcmV0W3Byb3BdID0gYXJnc1twcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gb2Zmc2V0Q3Vyc29yKGN1ciwgb2Zmc2V0TGluZSwgb2Zmc2V0Q2gpIHtcbiAgICAgIGlmICh0eXBlb2Ygb2Zmc2V0TGluZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgb2Zmc2V0Q2ggPSBvZmZzZXRMaW5lLmNoO1xuICAgICAgICBvZmZzZXRMaW5lID0gb2Zmc2V0TGluZS5saW5lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBvcyhjdXIubGluZSArIG9mZnNldExpbmUsIGN1ci5jaCArIG9mZnNldENoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29tbWFuZE1hdGNoZXMoa2V5cywga2V5TWFwLCBjb250ZXh0LCBpbnB1dFN0YXRlKSB7XG4gICAgICAvLyBQYXJ0aWFsIG1hdGNoZXMgYXJlIG5vdCBhcHBsaWVkLiBUaGV5IGluZm9ybSB0aGUga2V5IGhhbmRsZXJcbiAgICAgIC8vIHRoYXQgdGhlIGN1cnJlbnQga2V5IHNlcXVlbmNlIGlzIGEgc3Vic2VxdWVuY2Ugb2YgYSB2YWxpZCBrZXlcbiAgICAgIC8vIHNlcXVlbmNlLCBzbyB0aGF0IHRoZSBrZXkgYnVmZmVyIGlzIG5vdCBjbGVhcmVkLlxuICAgICAgdmFyIG1hdGNoLCBwYXJ0aWFsID0gW10sIGZ1bGwgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5TWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjb21tYW5kID0ga2V5TWFwW2ldO1xuICAgICAgICBpZiAoY29udGV4dCA9PSAnaW5zZXJ0JyAmJiBjb21tYW5kLmNvbnRleHQgIT0gJ2luc2VydCcgfHxcbiAgICAgICAgICAgIGNvbW1hbmQuY29udGV4dCAmJiBjb21tYW5kLmNvbnRleHQgIT0gY29udGV4dCB8fFxuICAgICAgICAgICAgaW5wdXRTdGF0ZS5vcGVyYXRvciAmJiBjb21tYW5kLnR5cGUgPT0gJ2FjdGlvbicgfHxcbiAgICAgICAgICAgICEobWF0Y2ggPSBjb21tYW5kTWF0Y2goa2V5cywgY29tbWFuZC5rZXlzKSkpIHsgY29udGludWU7IH1cbiAgICAgICAgaWYgKG1hdGNoID09ICdwYXJ0aWFsJykgeyBwYXJ0aWFsLnB1c2goY29tbWFuZCk7IH1cbiAgICAgICAgaWYgKG1hdGNoID09ICdmdWxsJykgeyBmdWxsLnB1c2goY29tbWFuZCk7IH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhcnRpYWw6IHBhcnRpYWwubGVuZ3RoICYmIHBhcnRpYWwsXG4gICAgICAgIGZ1bGw6IGZ1bGwubGVuZ3RoICYmIGZ1bGxcbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbW1hbmRNYXRjaChwcmVzc2VkLCBtYXBwZWQpIHtcbiAgICAgIGlmIChtYXBwZWQuc2xpY2UoLTExKSA9PSAnPGNoYXJhY3Rlcj4nKSB7XG4gICAgICAgIC8vIExhc3QgY2hhcmFjdGVyIG1hdGNoZXMgYW55dGhpbmcuXG4gICAgICAgIHZhciBwcmVmaXhMZW4gPSBtYXBwZWQubGVuZ3RoIC0gMTE7XG4gICAgICAgIHZhciBwcmVzc2VkUHJlZml4ID0gcHJlc3NlZC5zbGljZSgwLCBwcmVmaXhMZW4pO1xuICAgICAgICB2YXIgbWFwcGVkUHJlZml4ID0gbWFwcGVkLnNsaWNlKDAsIHByZWZpeExlbik7XG4gICAgICAgIHJldHVybiBwcmVzc2VkUHJlZml4ID09IG1hcHBlZFByZWZpeCAmJiBwcmVzc2VkLmxlbmd0aCA+IHByZWZpeExlbiA/ICdmdWxsJyA6XG4gICAgICAgICAgICAgICBtYXBwZWRQcmVmaXguaW5kZXhPZihwcmVzc2VkUHJlZml4KSA9PSAwID8gJ3BhcnRpYWwnIDogZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcHJlc3NlZCA9PSBtYXBwZWQgPyAnZnVsbCcgOlxuICAgICAgICAgICAgICAgbWFwcGVkLmluZGV4T2YocHJlc3NlZCkgPT0gMCA/ICdwYXJ0aWFsJyA6IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBsYXN0Q2hhcihrZXlzKSB7XG4gICAgICB2YXIgbWF0Y2ggPSAvXi4qKDxbXj5dKz4pJC8uZXhlYyhrZXlzKTtcbiAgICAgIHZhciBzZWxlY3RlZENoYXJhY3RlciA9IG1hdGNoID8gbWF0Y2hbMV0gOiBrZXlzLnNsaWNlKC0xKTtcbiAgICAgIGlmIChzZWxlY3RlZENoYXJhY3Rlci5sZW5ndGggPiAxKXtcbiAgICAgICAgc3dpdGNoKHNlbGVjdGVkQ2hhcmFjdGVyKXtcbiAgICAgICAgICBjYXNlICc8Q1I+JzpcbiAgICAgICAgICAgIHNlbGVjdGVkQ2hhcmFjdGVyPSdcXG4nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnPFNwYWNlPic6XG4gICAgICAgICAgICBzZWxlY3RlZENoYXJhY3Rlcj0nICc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc2VsZWN0ZWRDaGFyYWN0ZXI9Jyc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdGVkQ2hhcmFjdGVyO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXBlYXRGbihjbSwgZm4sIHJlcGVhdCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcGVhdDsgaSsrKSB7XG4gICAgICAgICAgZm4oY20pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb3B5Q3Vyc29yKGN1cikge1xuICAgICAgcmV0dXJuIFBvcyhjdXIubGluZSwgY3VyLmNoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3Vyc29yRXF1YWwoY3VyMSwgY3VyMikge1xuICAgICAgcmV0dXJuIGN1cjEuY2ggPT0gY3VyMi5jaCAmJiBjdXIxLmxpbmUgPT0gY3VyMi5saW5lO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjdXJzb3JJc0JlZm9yZShjdXIxLCBjdXIyKSB7XG4gICAgICBpZiAoY3VyMS5saW5lIDwgY3VyMi5saW5lKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGN1cjEubGluZSA9PSBjdXIyLmxpbmUgJiYgY3VyMS5jaCA8IGN1cjIuY2gpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGN1cnNvck1pbihjdXIxLCBjdXIyKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgY3VyMiA9IGN1cnNvck1pbi5hcHBseSh1bmRlZmluZWQsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnNvcklzQmVmb3JlKGN1cjEsIGN1cjIpID8gY3VyMSA6IGN1cjI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGN1cnNvck1heChjdXIxLCBjdXIyKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgY3VyMiA9IGN1cnNvck1heC5hcHBseSh1bmRlZmluZWQsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnNvcklzQmVmb3JlKGN1cjEsIGN1cjIpID8gY3VyMiA6IGN1cjE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGN1cnNvcklzQmV0d2VlbihjdXIxLCBjdXIyLCBjdXIzKSB7XG4gICAgICAvLyByZXR1cm5zIHRydWUgaWYgY3VyMiBpcyBiZXR3ZWVuIGN1cjEgYW5kIGN1cjMuXG4gICAgICB2YXIgY3VyMWJlZm9yZTIgPSBjdXJzb3JJc0JlZm9yZShjdXIxLCBjdXIyKTtcbiAgICAgIHZhciBjdXIyYmVmb3JlMyA9IGN1cnNvcklzQmVmb3JlKGN1cjIsIGN1cjMpO1xuICAgICAgcmV0dXJuIGN1cjFiZWZvcmUyICYmIGN1cjJiZWZvcmUzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaW5lTGVuZ3RoKGNtLCBsaW5lTnVtKSB7XG4gICAgICByZXR1cm4gY20uZ2V0TGluZShsaW5lTnVtKS5sZW5ndGg7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyaW0ocykge1xuICAgICAgaWYgKHMudHJpbSkge1xuICAgICAgICByZXR1cm4gcy50cmltKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHMpIHtcbiAgICAgIHJldHVybiBzLnJlcGxhY2UoLyhbLj8qKyRcXFtcXF1cXC9cXFxcKCl7fXxcXC1dKS9nLCAnXFxcXCQxJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV4dGVuZExpbmVUb0NvbHVtbihjbSwgbGluZU51bSwgY29sdW1uKSB7XG4gICAgICB2YXIgZW5kQ2ggPSBsaW5lTGVuZ3RoKGNtLCBsaW5lTnVtKTtcbiAgICAgIHZhciBzcGFjZXMgPSBuZXcgQXJyYXkoY29sdW1uLWVuZENoKzEpLmpvaW4oJyAnKTtcbiAgICAgIGNtLnNldEN1cnNvcihQb3MobGluZU51bSwgZW5kQ2gpKTtcbiAgICAgIGNtLnJlcGxhY2VSYW5nZShzcGFjZXMsIGNtLmdldEN1cnNvcigpKTtcbiAgICB9XG4gICAgLy8gVGhpcyBmdW5jdGlvbnMgc2VsZWN0cyBhIHJlY3Rhbmd1bGFyIGJsb2NrXG4gICAgLy8gb2YgdGV4dCB3aXRoIHNlbGVjdGlvbkVuZCBhcyBhbnkgb2YgaXRzIGNvcm5lclxuICAgIC8vIEhlaWdodCBvZiBibG9jazpcbiAgICAvLyBEaWZmZXJlbmNlIGluIHNlbGVjdGlvbkVuZC5saW5lIGFuZCBmaXJzdC9sYXN0IHNlbGVjdGlvbi5saW5lXG4gICAgLy8gV2lkdGggb2YgdGhlIGJsb2NrOlxuICAgIC8vIERpc3RhbmNlIGJldHdlZW4gc2VsZWN0aW9uRW5kLmNoIGFuZCBhbnkoZmlyc3QgY29uc2lkZXJlZCBoZXJlKSBzZWxlY3Rpb24uY2hcbiAgICBmdW5jdGlvbiBzZWxlY3RCbG9jayhjbSwgc2VsZWN0aW9uRW5kKSB7XG4gICAgICB2YXIgc2VsZWN0aW9ucyA9IFtdLCByYW5nZXMgPSBjbS5saXN0U2VsZWN0aW9ucygpO1xuICAgICAgdmFyIGhlYWQgPSBjb3B5Q3Vyc29yKGNtLmNsaXBQb3Moc2VsZWN0aW9uRW5kKSk7XG4gICAgICB2YXIgaXNDbGlwcGVkID0gIWN1cnNvckVxdWFsKHNlbGVjdGlvbkVuZCwgaGVhZCk7XG4gICAgICB2YXIgY3VySGVhZCA9IGNtLmdldEN1cnNvcignaGVhZCcpO1xuICAgICAgdmFyIHByaW1JbmRleCA9IGdldEluZGV4KHJhbmdlcywgY3VySGVhZCk7XG4gICAgICB2YXIgd2FzQ2xpcHBlZCA9IGN1cnNvckVxdWFsKHJhbmdlc1twcmltSW5kZXhdLmhlYWQsIHJhbmdlc1twcmltSW5kZXhdLmFuY2hvcik7XG4gICAgICB2YXIgbWF4ID0gcmFuZ2VzLmxlbmd0aCAtIDE7XG4gICAgICB2YXIgaW5kZXggPSBtYXggLSBwcmltSW5kZXggPiBwcmltSW5kZXggPyBtYXggOiAwO1xuICAgICAgdmFyIGJhc2UgPSByYW5nZXNbaW5kZXhdLmFuY2hvcjtcblxuICAgICAgdmFyIGZpcnN0TGluZSA9IE1hdGgubWluKGJhc2UubGluZSwgaGVhZC5saW5lKTtcbiAgICAgIHZhciBsYXN0TGluZSA9IE1hdGgubWF4KGJhc2UubGluZSwgaGVhZC5saW5lKTtcbiAgICAgIHZhciBiYXNlQ2ggPSBiYXNlLmNoLCBoZWFkQ2ggPSBoZWFkLmNoO1xuXG4gICAgICB2YXIgZGlyID0gcmFuZ2VzW2luZGV4XS5oZWFkLmNoIC0gYmFzZUNoO1xuICAgICAgdmFyIG5ld0RpciA9IGhlYWRDaCAtIGJhc2VDaDtcbiAgICAgIGlmIChkaXIgPiAwICYmIG5ld0RpciA8PSAwKSB7XG4gICAgICAgIGJhc2VDaCsrO1xuICAgICAgICBpZiAoIWlzQ2xpcHBlZCkgeyBoZWFkQ2gtLTsgfVxuICAgICAgfSBlbHNlIGlmIChkaXIgPCAwICYmIG5ld0RpciA+PSAwKSB7XG4gICAgICAgIGJhc2VDaC0tO1xuICAgICAgICBpZiAoIXdhc0NsaXBwZWQpIHsgaGVhZENoKys7IH1cbiAgICAgIH0gZWxzZSBpZiAoZGlyIDwgMCAmJiBuZXdEaXIgPT0gLTEpIHtcbiAgICAgICAgYmFzZUNoLS07XG4gICAgICAgIGhlYWRDaCsrO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgbGluZSA9IGZpcnN0TGluZTsgbGluZSA8PSBsYXN0TGluZTsgbGluZSsrKSB7XG4gICAgICAgIHZhciByYW5nZSA9IHthbmNob3I6IG5ldyBQb3MobGluZSwgYmFzZUNoKSwgaGVhZDogbmV3IFBvcyhsaW5lLCBoZWFkQ2gpfTtcbiAgICAgICAgc2VsZWN0aW9ucy5wdXNoKHJhbmdlKTtcbiAgICAgIH1cbiAgICAgIGNtLnNldFNlbGVjdGlvbnMoc2VsZWN0aW9ucyk7XG4gICAgICBzZWxlY3Rpb25FbmQuY2ggPSBoZWFkQ2g7XG4gICAgICBiYXNlLmNoID0gYmFzZUNoO1xuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNlbGVjdEZvckluc2VydChjbSwgaGVhZCwgaGVpZ2h0KSB7XG4gICAgICB2YXIgc2VsID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlaWdodDsgaSsrKSB7XG4gICAgICAgIHZhciBsaW5lSGVhZCA9IG9mZnNldEN1cnNvcihoZWFkLCBpLCAwKTtcbiAgICAgICAgc2VsLnB1c2goe2FuY2hvcjogbGluZUhlYWQsIGhlYWQ6IGxpbmVIZWFkfSk7XG4gICAgICB9XG4gICAgICBjbS5zZXRTZWxlY3Rpb25zKHNlbCwgMCk7XG4gICAgfVxuICAgIC8vIGdldEluZGV4IHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBjdXJzb3IgaW4gdGhlIHNlbGVjdGlvbnMuXG4gICAgZnVuY3Rpb24gZ2V0SW5kZXgocmFuZ2VzLCBjdXJzb3IsIGVuZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGF0QW5jaG9yID0gZW5kICE9ICdoZWFkJyAmJiBjdXJzb3JFcXVhbChyYW5nZXNbaV0uYW5jaG9yLCBjdXJzb3IpO1xuICAgICAgICB2YXIgYXRIZWFkID0gZW5kICE9ICdhbmNob3InICYmIGN1cnNvckVxdWFsKHJhbmdlc1tpXS5oZWFkLCBjdXJzb3IpO1xuICAgICAgICBpZiAoYXRBbmNob3IgfHwgYXRIZWFkKSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRBcmVhUmFuZ2UoY20sIHZpbSkge1xuICAgICAgdmFyIGxhc3RTZWxlY3Rpb24gPSB2aW0ubGFzdFNlbGVjdGlvbjtcbiAgICAgIHZhciBnZXRDdXJyZW50U2VsZWN0ZWRBcmVhUmFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGVjdGlvbnMgPSBjbS5saXN0U2VsZWN0aW9ucygpO1xuICAgICAgICB2YXIgc3RhcnQgPSAgc2VsZWN0aW9uc1swXTtcbiAgICAgICAgdmFyIGVuZCA9IHNlbGVjdGlvbnNbc2VsZWN0aW9ucy5sZW5ndGgtMV07XG4gICAgICAgIHZhciBzZWxlY3Rpb25TdGFydCA9IGN1cnNvcklzQmVmb3JlKHN0YXJ0LmFuY2hvciwgc3RhcnQuaGVhZCkgPyBzdGFydC5hbmNob3IgOiBzdGFydC5oZWFkO1xuICAgICAgICB2YXIgc2VsZWN0aW9uRW5kID0gY3Vyc29ySXNCZWZvcmUoZW5kLmFuY2hvciwgZW5kLmhlYWQpID8gZW5kLmhlYWQgOiBlbmQuYW5jaG9yO1xuICAgICAgICByZXR1cm4gW3NlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmRdO1xuICAgICAgfTtcbiAgICAgIHZhciBnZXRMYXN0U2VsZWN0ZWRBcmVhUmFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGVjdGlvblN0YXJ0ID0gY20uZ2V0Q3Vyc29yKCk7XG4gICAgICAgIHZhciBzZWxlY3Rpb25FbmQgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgdmFyIGJsb2NrID0gbGFzdFNlbGVjdGlvbi52aXN1YWxCbG9jaztcbiAgICAgICAgaWYgKGJsb2NrKSB7XG4gICAgICAgICAgdmFyIHdpZHRoID0gYmxvY2sud2lkdGg7XG4gICAgICAgICAgdmFyIGhlaWdodCA9IGJsb2NrLmhlaWdodDtcbiAgICAgICAgICBzZWxlY3Rpb25FbmQgPSBQb3Moc2VsZWN0aW9uU3RhcnQubGluZSArIGhlaWdodCwgc2VsZWN0aW9uU3RhcnQuY2ggKyB3aWR0aCk7XG4gICAgICAgICAgdmFyIHNlbGVjdGlvbnMgPSBbXTtcbiAgICAgICAgICAvLyBzZWxlY3RCbG9jayBjcmVhdGVzIGEgJ3Byb3BlcicgcmVjdGFuZ3VsYXIgYmxvY2suXG4gICAgICAgICAgLy8gV2UgZG8gbm90IHdhbnQgdGhhdCBpbiBhbGwgY2FzZXMsIHNvIHdlIG1hbnVhbGx5IHNldCBzZWxlY3Rpb25zLlxuICAgICAgICAgIGZvciAodmFyIGkgPSBzZWxlY3Rpb25TdGFydC5saW5lOyBpIDwgc2VsZWN0aW9uRW5kLmxpbmU7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFuY2hvciA9IFBvcyhpLCBzZWxlY3Rpb25TdGFydC5jaCk7XG4gICAgICAgICAgICB2YXIgaGVhZCA9IFBvcyhpLCBzZWxlY3Rpb25FbmQuY2gpO1xuICAgICAgICAgICAgdmFyIHJhbmdlID0ge2FuY2hvcjogYW5jaG9yLCBoZWFkOiBoZWFkfTtcbiAgICAgICAgICAgIHNlbGVjdGlvbnMucHVzaChyYW5nZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNtLnNldFNlbGVjdGlvbnMoc2VsZWN0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHN0YXJ0ID0gbGFzdFNlbGVjdGlvbi5hbmNob3JNYXJrLmZpbmQoKTtcbiAgICAgICAgICB2YXIgZW5kID0gbGFzdFNlbGVjdGlvbi5oZWFkTWFyay5maW5kKCk7XG4gICAgICAgICAgdmFyIGxpbmUgPSBlbmQubGluZSAtIHN0YXJ0LmxpbmU7XG4gICAgICAgICAgdmFyIGNoID0gZW5kLmNoIC0gc3RhcnQuY2g7XG4gICAgICAgICAgc2VsZWN0aW9uRW5kID0ge2xpbmU6IHNlbGVjdGlvbkVuZC5saW5lICsgbGluZSwgY2g6IGxpbmUgPyBzZWxlY3Rpb25FbmQuY2ggOiBjaCArIHNlbGVjdGlvbkVuZC5jaH07XG4gICAgICAgICAgaWYgKGxhc3RTZWxlY3Rpb24udmlzdWFsTGluZSkge1xuICAgICAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSBQb3Moc2VsZWN0aW9uU3RhcnQubGluZSwgMCk7XG4gICAgICAgICAgICBzZWxlY3Rpb25FbmQgPSBQb3Moc2VsZWN0aW9uRW5kLmxpbmUsIGxpbmVMZW5ndGgoY20sIHNlbGVjdGlvbkVuZC5saW5lKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNtLnNldFNlbGVjdGlvbihzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3NlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmRdO1xuICAgICAgfTtcbiAgICAgIGlmICghdmltLnZpc3VhbE1vZGUpIHtcbiAgICAgIC8vIEluIGNhc2Ugb2YgcmVwbGF5aW5nIHRoZSBhY3Rpb24uXG4gICAgICAgIHJldHVybiBnZXRMYXN0U2VsZWN0ZWRBcmVhUmFuZ2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBnZXRDdXJyZW50U2VsZWN0ZWRBcmVhUmFuZ2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gVXBkYXRlcyB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIHdpdGggdGhlIGN1cnJlbnQgc2VsZWN0aW9uJ3MgdmFsdWVzLiBUaGlzXG4gICAgLy8gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGluIHZpc3VhbCBtb2RlLlxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxhc3RTZWxlY3Rpb24oY20sIHZpbSkge1xuICAgICAgdmFyIGFuY2hvciA9IHZpbS5zZWwuYW5jaG9yO1xuICAgICAgdmFyIGhlYWQgPSB2aW0uc2VsLmhlYWQ7XG4gICAgICAvLyBUbyBhY2NvbW1vZGF0ZSB0aGUgZWZmZWN0IG9mIGxhc3RQYXN0ZWRUZXh0IGluIHRoZSBsYXN0IHNlbGVjdGlvblxuICAgICAgaWYgKHZpbS5sYXN0UGFzdGVkVGV4dCkge1xuICAgICAgICBoZWFkID0gY20ucG9zRnJvbUluZGV4KGNtLmluZGV4RnJvbVBvcyhhbmNob3IpICsgdmltLmxhc3RQYXN0ZWRUZXh0Lmxlbmd0aCk7XG4gICAgICAgIHZpbS5sYXN0UGFzdGVkVGV4dCA9IG51bGw7XG4gICAgICB9XG4gICAgICB2aW0ubGFzdFNlbGVjdGlvbiA9IHsnYW5jaG9yTWFyayc6IGNtLnNldEJvb2ttYXJrKGFuY2hvciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVhZE1hcmsnOiBjbS5zZXRCb29rbWFyayhoZWFkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdhbmNob3InOiBjb3B5Q3Vyc29yKGFuY2hvciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVhZCc6IGNvcHlDdXJzb3IoaGVhZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAndmlzdWFsTW9kZSc6IHZpbS52aXN1YWxNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Zpc3VhbExpbmUnOiB2aW0udmlzdWFsTGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICd2aXN1YWxCbG9jayc6IHZpbS52aXN1YWxCbG9ja307XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV4cGFuZFNlbGVjdGlvbihjbSwgc3RhcnQsIGVuZCkge1xuICAgICAgdmFyIHNlbCA9IGNtLnN0YXRlLnZpbS5zZWw7XG4gICAgICB2YXIgaGVhZCA9IHNlbC5oZWFkO1xuICAgICAgdmFyIGFuY2hvciA9IHNlbC5hbmNob3I7XG4gICAgICB2YXIgdG1wO1xuICAgICAgaWYgKGN1cnNvcklzQmVmb3JlKGVuZCwgc3RhcnQpKSB7XG4gICAgICAgIHRtcCA9IGVuZDtcbiAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ID0gdG1wO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnNvcklzQmVmb3JlKGhlYWQsIGFuY2hvcikpIHtcbiAgICAgICAgaGVhZCA9IGN1cnNvck1pbihzdGFydCwgaGVhZCk7XG4gICAgICAgIGFuY2hvciA9IGN1cnNvck1heChhbmNob3IsIGVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbmNob3IgPSBjdXJzb3JNaW4oc3RhcnQsIGFuY2hvcik7XG4gICAgICAgIGhlYWQgPSBjdXJzb3JNYXgoaGVhZCwgZW5kKTtcbiAgICAgICAgaGVhZCA9IG9mZnNldEN1cnNvcihoZWFkLCAwLCAtMSk7XG4gICAgICAgIGlmIChoZWFkLmNoID09IC0xICYmIGhlYWQubGluZSAhPSBjbS5maXJzdExpbmUoKSkge1xuICAgICAgICAgIGhlYWQgPSBQb3MoaGVhZC5saW5lIC0gMSwgbGluZUxlbmd0aChjbSwgaGVhZC5saW5lIC0gMSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gW2FuY2hvciwgaGVhZF07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIENvZGVNaXJyb3Igc2VsZWN0aW9uIHRvIG1hdGNoIHRoZSBwcm92aWRlZCB2aW0gc2VsZWN0aW9uLlxuICAgICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgZ2l2ZW4sIGl0IHVzZXMgdGhlIGN1cnJlbnQgdmltIHNlbGVjdGlvbiBzdGF0ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGVDbVNlbGVjdGlvbihjbSwgc2VsLCBtb2RlKSB7XG4gICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgc2VsID0gc2VsIHx8IHZpbS5zZWw7XG4gICAgICB2YXIgbW9kZSA9IG1vZGUgfHxcbiAgICAgICAgdmltLnZpc3VhbExpbmUgPyAnbGluZScgOiB2aW0udmlzdWFsQmxvY2sgPyAnYmxvY2snIDogJ2NoYXInO1xuICAgICAgdmFyIGNtU2VsID0gbWFrZUNtU2VsZWN0aW9uKGNtLCBzZWwsIG1vZGUpO1xuICAgICAgY20uc2V0U2VsZWN0aW9ucyhjbVNlbC5yYW5nZXMsIGNtU2VsLnByaW1hcnkpO1xuICAgICAgdXBkYXRlRmFrZUN1cnNvcihjbSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1ha2VDbVNlbGVjdGlvbihjbSwgc2VsLCBtb2RlLCBleGNsdXNpdmUpIHtcbiAgICAgIHZhciBoZWFkID0gY29weUN1cnNvcihzZWwuaGVhZCk7XG4gICAgICB2YXIgYW5jaG9yID0gY29weUN1cnNvcihzZWwuYW5jaG9yKTtcbiAgICAgIGlmIChtb2RlID09ICdjaGFyJykge1xuICAgICAgICB2YXIgaGVhZE9mZnNldCA9ICFleGNsdXNpdmUgJiYgIWN1cnNvcklzQmVmb3JlKHNlbC5oZWFkLCBzZWwuYW5jaG9yKSA/IDEgOiAwO1xuICAgICAgICB2YXIgYW5jaG9yT2Zmc2V0ID0gY3Vyc29ySXNCZWZvcmUoc2VsLmhlYWQsIHNlbC5hbmNob3IpID8gMSA6IDA7XG4gICAgICAgIGhlYWQgPSBvZmZzZXRDdXJzb3Ioc2VsLmhlYWQsIDAsIGhlYWRPZmZzZXQpO1xuICAgICAgICBhbmNob3IgPSBvZmZzZXRDdXJzb3Ioc2VsLmFuY2hvciwgMCwgYW5jaG9yT2Zmc2V0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByYW5nZXM6IFt7YW5jaG9yOiBhbmNob3IsIGhlYWQ6IGhlYWR9XSxcbiAgICAgICAgICBwcmltYXJ5OiAwXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT0gJ2xpbmUnKSB7XG4gICAgICAgIGlmICghY3Vyc29ySXNCZWZvcmUoc2VsLmhlYWQsIHNlbC5hbmNob3IpKSB7XG4gICAgICAgICAgYW5jaG9yLmNoID0gMDtcblxuICAgICAgICAgIHZhciBsYXN0TGluZSA9IGNtLmxhc3RMaW5lKCk7XG4gICAgICAgICAgaWYgKGhlYWQubGluZSA+IGxhc3RMaW5lKSB7XG4gICAgICAgICAgICBoZWFkLmxpbmUgPSBsYXN0TGluZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaGVhZC5jaCA9IGxpbmVMZW5ndGgoY20sIGhlYWQubGluZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGVhZC5jaCA9IDA7XG4gICAgICAgICAgYW5jaG9yLmNoID0gbGluZUxlbmd0aChjbSwgYW5jaG9yLmxpbmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmFuZ2VzOiBbe2FuY2hvcjogYW5jaG9yLCBoZWFkOiBoZWFkfV0sXG4gICAgICAgICAgcHJpbWFyeTogMFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChtb2RlID09ICdibG9jaycpIHtcbiAgICAgICAgdmFyIHRvcCA9IE1hdGgubWluKGFuY2hvci5saW5lLCBoZWFkLmxpbmUpLFxuICAgICAgICAgICAgbGVmdCA9IE1hdGgubWluKGFuY2hvci5jaCwgaGVhZC5jaCksXG4gICAgICAgICAgICBib3R0b20gPSBNYXRoLm1heChhbmNob3IubGluZSwgaGVhZC5saW5lKSxcbiAgICAgICAgICAgIHJpZ2h0ID0gTWF0aC5tYXgoYW5jaG9yLmNoLCBoZWFkLmNoKSArIDE7XG4gICAgICAgIHZhciBoZWlnaHQgPSBib3R0b20gLSB0b3AgKyAxO1xuICAgICAgICB2YXIgcHJpbWFyeSA9IGhlYWQubGluZSA9PSB0b3AgPyAwIDogaGVpZ2h0IC0gMTtcbiAgICAgICAgdmFyIHJhbmdlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlaWdodDsgaSsrKSB7XG4gICAgICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICAgICAgYW5jaG9yOiBQb3ModG9wICsgaSwgbGVmdCksXG4gICAgICAgICAgICBoZWFkOiBQb3ModG9wICsgaSwgcmlnaHQpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByYW5nZXM6IHJhbmdlcyxcbiAgICAgICAgICBwcmltYXJ5OiBwcmltYXJ5XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldEhlYWQoY20pIHtcbiAgICAgIHZhciBjdXIgPSBjbS5nZXRDdXJzb3IoJ2hlYWQnKTtcbiAgICAgIGlmIChjbS5nZXRTZWxlY3Rpb24oKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAvLyBTbWFsbCBjb3JuZXIgY2FzZSB3aGVuIG9ubHkgMSBjaGFyYWN0ZXIgaXMgc2VsZWN0ZWQuIFRoZSBcInJlYWxcIlxuICAgICAgICAvLyBoZWFkIGlzIHRoZSBsZWZ0IG9mIGhlYWQgYW5kIGFuY2hvci5cbiAgICAgICAgY3VyID0gY3Vyc29yTWluKGN1ciwgY20uZ2V0Q3Vyc29yKCdhbmNob3InKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIG1vdmVIZWFkIGlzIHNldCB0byBmYWxzZSwgdGhlIENvZGVNaXJyb3Igc2VsZWN0aW9uIHdpbGwgbm90IGJlXG4gICAgICogdG91Y2hlZC4gVGhlIGNhbGxlciBhc3N1bWVzIHRoZSByZXNwb25zaWJpbGl0eSBvZiBwdXR0aW5nIHRoZSBjdXJzb3JcbiAgICAqIGluIHRoZSByaWdodCBwbGFjZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBleGl0VmlzdWFsTW9kZShjbSwgbW92ZUhlYWQpIHtcbiAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICBpZiAobW92ZUhlYWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGNtLnNldEN1cnNvcihjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCB2aW0uc2VsLmhlYWQpKTtcbiAgICAgIH1cbiAgICAgIHVwZGF0ZUxhc3RTZWxlY3Rpb24oY20sIHZpbSk7XG4gICAgICB2aW0udmlzdWFsTW9kZSA9IGZhbHNlO1xuICAgICAgdmltLnZpc3VhbExpbmUgPSBmYWxzZTtcbiAgICAgIHZpbS52aXN1YWxCbG9jayA9IGZhbHNlO1xuICAgICAgQ29kZU1pcnJvci5zaWduYWwoY20sIFwidmltLW1vZGUtY2hhbmdlXCIsIHttb2RlOiBcIm5vcm1hbFwifSk7XG4gICAgICBpZiAodmltLmZha2VDdXJzb3IpIHtcbiAgICAgICAgdmltLmZha2VDdXJzb3IuY2xlYXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYW55IHRyYWlsaW5nIG5ld2xpbmVzIGZyb20gdGhlIHNlbGVjdGlvbi4gRm9yXG4gICAgLy8gZXhhbXBsZSwgd2l0aCB0aGUgY2FyZXQgYXQgdGhlIHN0YXJ0IG9mIHRoZSBsYXN0IHdvcmQgb24gdGhlIGxpbmUsXG4gICAgLy8gJ2R3JyBzaG91bGQgd29yZCwgYnV0IG5vdCB0aGUgbmV3bGluZSwgd2hpbGUgJ3cnIHNob3VsZCBhZHZhbmNlIHRoZVxuICAgIC8vIGNhcmV0IHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIG5leHQgbGluZS5cbiAgICBmdW5jdGlvbiBjbGlwVG9MaW5lKGNtLCBjdXJTdGFydCwgY3VyRW5kKSB7XG4gICAgICB2YXIgc2VsZWN0aW9uID0gY20uZ2V0UmFuZ2UoY3VyU3RhcnQsIGN1ckVuZCk7XG4gICAgICAvLyBPbmx5IGNsaXAgaWYgdGhlIHNlbGVjdGlvbiBlbmRzIHdpdGggdHJhaWxpbmcgbmV3bGluZSArIHdoaXRlc3BhY2VcbiAgICAgIGlmICgvXFxuXFxzKiQvLnRlc3Qoc2VsZWN0aW9uKSkge1xuICAgICAgICB2YXIgbGluZXMgPSBzZWxlY3Rpb24uc3BsaXQoJ1xcbicpO1xuICAgICAgICAvLyBXZSBrbm93IHRoaXMgaXMgYWxsIHdoaXRlc3BhY2UuXG4gICAgICAgIGxpbmVzLnBvcCgpO1xuXG4gICAgICAgIC8vIENhc2VzOlxuICAgICAgICAvLyAxLiBMYXN0IHdvcmQgaXMgYW4gZW1wdHkgbGluZSAtIGRvIG5vdCBjbGlwIHRoZSB0cmFpbGluZyAnXFxuJ1xuICAgICAgICAvLyAyLiBMYXN0IHdvcmQgaXMgbm90IGFuIGVtcHR5IGxpbmUgLSBjbGlwIHRoZSB0cmFpbGluZyAnXFxuJ1xuICAgICAgICB2YXIgbGluZTtcbiAgICAgICAgLy8gRmluZCB0aGUgbGluZSBjb250YWluaW5nIHRoZSBsYXN0IHdvcmQsIGFuZCBjbGlwIGFsbCB3aGl0ZXNwYWNlIHVwXG4gICAgICAgIC8vIHRvIGl0LlxuICAgICAgICBmb3IgKHZhciBsaW5lID0gbGluZXMucG9wKCk7IGxpbmVzLmxlbmd0aCA+IDAgJiYgbGluZSAmJiBpc1doaXRlU3BhY2VTdHJpbmcobGluZSk7IGxpbmUgPSBsaW5lcy5wb3AoKSkge1xuICAgICAgICAgIGN1ckVuZC5saW5lLS07XG4gICAgICAgICAgY3VyRW5kLmNoID0gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGUgbGFzdCB3b3JkIGlzIG5vdCBhbiBlbXB0eSBsaW5lLCBjbGlwIGFuIGFkZGl0aW9uYWwgbmV3bGluZVxuICAgICAgICBpZiAobGluZSkge1xuICAgICAgICAgIGN1ckVuZC5saW5lLS07XG4gICAgICAgICAgY3VyRW5kLmNoID0gbGluZUxlbmd0aChjbSwgY3VyRW5kLmxpbmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1ckVuZC5jaCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFeHBhbmQgdGhlIHNlbGVjdGlvbiB0byBsaW5lIGVuZHMuXG4gICAgZnVuY3Rpb24gZXhwYW5kU2VsZWN0aW9uVG9MaW5lKF9jbSwgY3VyU3RhcnQsIGN1ckVuZCkge1xuICAgICAgY3VyU3RhcnQuY2ggPSAwO1xuICAgICAgY3VyRW5kLmNoID0gMDtcbiAgICAgIGN1ckVuZC5saW5lKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3Rlcih0ZXh0KSB7XG4gICAgICBpZiAoIXRleHQpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICB2YXIgZmlyc3ROb25XUyA9IHRleHQuc2VhcmNoKC9cXFMvKTtcbiAgICAgIHJldHVybiBmaXJzdE5vbldTID09IC0xID8gdGV4dC5sZW5ndGggOiBmaXJzdE5vbldTO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGFuZFdvcmRVbmRlckN1cnNvcihjbSwgaW5jbHVzaXZlLCBfZm9yd2FyZCwgYmlnV29yZCwgbm9TeW1ib2wpIHtcbiAgICAgIHZhciBjdXIgPSBnZXRIZWFkKGNtKTtcbiAgICAgIHZhciBsaW5lID0gY20uZ2V0TGluZShjdXIubGluZSk7XG4gICAgICB2YXIgaWR4ID0gY3VyLmNoO1xuXG4gICAgICAvLyBTZWVrIHRvIGZpcnN0IHdvcmQgb3Igbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyLCBkZXBlbmRpbmcgb24gaWZcbiAgICAgIC8vIG5vU3ltYm9sIGlzIHRydWUuXG4gICAgICB2YXIgdGVzdCA9IG5vU3ltYm9sID8gd29yZENoYXJUZXN0WzBdIDogYmlnV29yZENoYXJUZXN0IFswXTtcbiAgICAgIHdoaWxlICghdGVzdChsaW5lLmNoYXJBdChpZHgpKSkge1xuICAgICAgICBpZHgrKztcbiAgICAgICAgaWYgKGlkeCA+PSBsaW5lLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYmlnV29yZCkge1xuICAgICAgICB0ZXN0ID0gYmlnV29yZENoYXJUZXN0WzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGVzdCA9IHdvcmRDaGFyVGVzdFswXTtcbiAgICAgICAgaWYgKCF0ZXN0KGxpbmUuY2hhckF0KGlkeCkpKSB7XG4gICAgICAgICAgdGVzdCA9IHdvcmRDaGFyVGVzdFsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZW5kID0gaWR4LCBzdGFydCA9IGlkeDtcbiAgICAgIHdoaWxlICh0ZXN0KGxpbmUuY2hhckF0KGVuZCkpICYmIGVuZCA8IGxpbmUubGVuZ3RoKSB7IGVuZCsrOyB9XG4gICAgICB3aGlsZSAodGVzdChsaW5lLmNoYXJBdChzdGFydCkpICYmIHN0YXJ0ID49IDApIHsgc3RhcnQtLTsgfVxuICAgICAgc3RhcnQrKztcblxuICAgICAgaWYgKGluY2x1c2l2ZSkge1xuICAgICAgICAvLyBJZiBwcmVzZW50LCBpbmNsdWRlIGFsbCB3aGl0ZXNwYWNlIGFmdGVyIHdvcmQuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgaW5jbHVkZSBhbGwgd2hpdGVzcGFjZSBiZWZvcmUgd29yZCwgZXhjZXB0IGluZGVudGF0aW9uLlxuICAgICAgICB2YXIgd29yZEVuZCA9IGVuZDtcbiAgICAgICAgd2hpbGUgKC9cXHMvLnRlc3QobGluZS5jaGFyQXQoZW5kKSkgJiYgZW5kIDwgbGluZS5sZW5ndGgpIHsgZW5kKys7IH1cbiAgICAgICAgaWYgKHdvcmRFbmQgPT0gZW5kKSB7XG4gICAgICAgICAgdmFyIHdvcmRTdGFydCA9IHN0YXJ0O1xuICAgICAgICAgIHdoaWxlICgvXFxzLy50ZXN0KGxpbmUuY2hhckF0KHN0YXJ0IC0gMSkpICYmIHN0YXJ0ID4gMCkgeyBzdGFydC0tOyB9XG4gICAgICAgICAgaWYgKCFzdGFydCkgeyBzdGFydCA9IHdvcmRTdGFydDsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdGFydDogUG9zKGN1ci5saW5lLCBzdGFydCksIGVuZDogUG9zKGN1ci5saW5lLCBlbmQpIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVjb3JkSnVtcFBvc2l0aW9uKGNtLCBvbGRDdXIsIG5ld0N1cikge1xuICAgICAgaWYgKCFjdXJzb3JFcXVhbChvbGRDdXIsIG5ld0N1cikpIHtcbiAgICAgICAgdmltR2xvYmFsU3RhdGUuanVtcExpc3QuYWRkKGNtLCBvbGRDdXIsIG5ld0N1cik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVjb3JkTGFzdENoYXJhY3RlclNlYXJjaChpbmNyZW1lbnQsIGFyZ3MpIHtcbiAgICAgICAgdmltR2xvYmFsU3RhdGUubGFzdENoYXJhY3RlclNlYXJjaC5pbmNyZW1lbnQgPSBpbmNyZW1lbnQ7XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLmxhc3RDaGFyYWN0ZXJTZWFyY2guZm9yd2FyZCA9IGFyZ3MuZm9yd2FyZDtcbiAgICAgICAgdmltR2xvYmFsU3RhdGUubGFzdENoYXJhY3RlclNlYXJjaC5zZWxlY3RlZENoYXJhY3RlciA9IGFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgfVxuXG4gICAgdmFyIHN5bWJvbFRvTW9kZSA9IHtcbiAgICAgICAgJygnOiAnYnJhY2tldCcsICcpJzogJ2JyYWNrZXQnLCAneyc6ICdicmFja2V0JywgJ30nOiAnYnJhY2tldCcsXG4gICAgICAgICdbJzogJ3NlY3Rpb24nLCAnXSc6ICdzZWN0aW9uJyxcbiAgICAgICAgJyonOiAnY29tbWVudCcsICcvJzogJ2NvbW1lbnQnLFxuICAgICAgICAnbSc6ICdtZXRob2QnLCAnTSc6ICdtZXRob2QnLFxuICAgICAgICAnIyc6ICdwcmVwcm9jZXNzJ1xuICAgIH07XG4gICAgdmFyIGZpbmRTeW1ib2xNb2RlcyA9IHtcbiAgICAgIGJyYWNrZXQ6IHtcbiAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICBpZiAoc3RhdGUubmV4dENoID09PSBzdGF0ZS5zeW1iKSB7XG4gICAgICAgICAgICBzdGF0ZS5kZXB0aCsrO1xuICAgICAgICAgICAgaWYgKHN0YXRlLmRlcHRoID49IDEpcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5uZXh0Q2ggPT09IHN0YXRlLnJldmVyc2VTeW1iKSB7XG4gICAgICAgICAgICBzdGF0ZS5kZXB0aC0tO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzZWN0aW9uOiB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgc3RhdGUuY3VyTW92ZVRocm91Z2ggPSB0cnVlO1xuICAgICAgICAgIHN0YXRlLnN5bWIgPSAoc3RhdGUuZm9yd2FyZCA/ICddJyA6ICdbJykgPT09IHN0YXRlLnN5bWIgPyAneycgOiAnfSc7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLmluZGV4ID09PSAwICYmIHN0YXRlLm5leHRDaCA9PT0gc3RhdGUuc3ltYjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbW1lbnQ6IHtcbiAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICB2YXIgZm91bmQgPSBzdGF0ZS5sYXN0Q2ggPT09ICcqJyAmJiBzdGF0ZS5uZXh0Q2ggPT09ICcvJztcbiAgICAgICAgICBzdGF0ZS5sYXN0Q2ggPSBzdGF0ZS5uZXh0Q2g7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gVE9ETzogVGhlIG9yaWdpbmFsIFZpbSBpbXBsZW1lbnRhdGlvbiBvbmx5IG9wZXJhdGVzIG9uIGxldmVsIDEgYW5kIDIuXG4gICAgICAvLyBUaGUgY3VycmVudCBpbXBsZW1lbnRhdGlvbiBkb2Vzbid0IGNoZWNrIGZvciBjb2RlIGJsb2NrIGxldmVsIGFuZFxuICAgICAgLy8gdGhlcmVmb3JlIGl0IG9wZXJhdGVzIG9uIGFueSBsZXZlbHMuXG4gICAgICBtZXRob2Q6IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICBzdGF0ZS5zeW1iID0gKHN0YXRlLnN5bWIgPT09ICdtJyA/ICd7JyA6ICd9Jyk7XG4gICAgICAgICAgc3RhdGUucmV2ZXJzZVN5bWIgPSBzdGF0ZS5zeW1iID09PSAneycgPyAnfScgOiAneyc7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgaWYgKHN0YXRlLm5leHRDaCA9PT0gc3RhdGUuc3ltYilyZXR1cm4gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzOiB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgc3RhdGUuaW5kZXggPSAwO1xuICAgICAgICB9LFxuICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAgIGlmIChzdGF0ZS5uZXh0Q2ggPT09ICcjJykge1xuICAgICAgICAgICAgdmFyIHRva2VuID0gc3RhdGUubGluZVRleHQubWF0Y2goLyMoXFx3KykvKVsxXTtcbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJ2VuZGlmJykge1xuICAgICAgICAgICAgICBpZiAoc3RhdGUuZm9yd2FyZCAmJiBzdGF0ZS5kZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN0YXRlLmRlcHRoKys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuID09PSAnaWYnKSB7XG4gICAgICAgICAgICAgIGlmICghc3RhdGUuZm9yd2FyZCAmJiBzdGF0ZS5kZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN0YXRlLmRlcHRoLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG9rZW4gPT09ICdlbHNlJyAmJiBzdGF0ZS5kZXB0aCA9PT0gMClyZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBmdW5jdGlvbiBmaW5kU3ltYm9sKGNtLCByZXBlYXQsIGZvcndhcmQsIHN5bWIpIHtcbiAgICAgIHZhciBjdXIgPSBjb3B5Q3Vyc29yKGNtLmdldEN1cnNvcigpKTtcbiAgICAgIHZhciBpbmNyZW1lbnQgPSBmb3J3YXJkID8gMSA6IC0xO1xuICAgICAgdmFyIGVuZExpbmUgPSBmb3J3YXJkID8gY20ubGluZUNvdW50KCkgOiAtMTtcbiAgICAgIHZhciBjdXJDaCA9IGN1ci5jaDtcbiAgICAgIHZhciBsaW5lID0gY3VyLmxpbmU7XG4gICAgICB2YXIgbGluZVRleHQgPSBjbS5nZXRMaW5lKGxpbmUpO1xuICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICBsaW5lVGV4dDogbGluZVRleHQsXG4gICAgICAgIG5leHRDaDogbGluZVRleHQuY2hhckF0KGN1ckNoKSxcbiAgICAgICAgbGFzdENoOiBudWxsLFxuICAgICAgICBpbmRleDogY3VyQ2gsXG4gICAgICAgIHN5bWI6IHN5bWIsXG4gICAgICAgIHJldmVyc2VTeW1iOiAoZm9yd2FyZCA/ICB7ICcpJzogJygnLCAnfSc6ICd7JyB9IDogeyAnKCc6ICcpJywgJ3snOiAnfScgfSlbc3ltYl0sXG4gICAgICAgIGZvcndhcmQ6IGZvcndhcmQsXG4gICAgICAgIGRlcHRoOiAwLFxuICAgICAgICBjdXJNb3ZlVGhyb3VnaDogZmFsc2VcbiAgICAgIH07XG4gICAgICB2YXIgbW9kZSA9IHN5bWJvbFRvTW9kZVtzeW1iXTtcbiAgICAgIGlmICghbW9kZSlyZXR1cm4gY3VyO1xuICAgICAgdmFyIGluaXQgPSBmaW5kU3ltYm9sTW9kZXNbbW9kZV0uaW5pdDtcbiAgICAgIHZhciBpc0NvbXBsZXRlID0gZmluZFN5bWJvbE1vZGVzW21vZGVdLmlzQ29tcGxldGU7XG4gICAgICBpZiAoaW5pdCkgeyBpbml0KHN0YXRlKTsgfVxuICAgICAgd2hpbGUgKGxpbmUgIT09IGVuZExpbmUgJiYgcmVwZWF0KSB7XG4gICAgICAgIHN0YXRlLmluZGV4ICs9IGluY3JlbWVudDtcbiAgICAgICAgc3RhdGUubmV4dENoID0gc3RhdGUubGluZVRleHQuY2hhckF0KHN0YXRlLmluZGV4KTtcbiAgICAgICAgaWYgKCFzdGF0ZS5uZXh0Q2gpIHtcbiAgICAgICAgICBsaW5lICs9IGluY3JlbWVudDtcbiAgICAgICAgICBzdGF0ZS5saW5lVGV4dCA9IGNtLmdldExpbmUobGluZSkgfHwgJyc7XG4gICAgICAgICAgaWYgKGluY3JlbWVudCA+IDApIHtcbiAgICAgICAgICAgIHN0YXRlLmluZGV4ID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGxpbmVMZW4gPSBzdGF0ZS5saW5lVGV4dC5sZW5ndGg7XG4gICAgICAgICAgICBzdGF0ZS5pbmRleCA9IChsaW5lTGVuID4gMCkgPyAobGluZUxlbi0xKSA6IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXRlLm5leHRDaCA9IHN0YXRlLmxpbmVUZXh0LmNoYXJBdChzdGF0ZS5pbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ29tcGxldGUoc3RhdGUpKSB7XG4gICAgICAgICAgY3VyLmxpbmUgPSBsaW5lO1xuICAgICAgICAgIGN1ci5jaCA9IHN0YXRlLmluZGV4O1xuICAgICAgICAgIHJlcGVhdC0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUubmV4dENoIHx8IHN0YXRlLmN1ck1vdmVUaHJvdWdoKSB7XG4gICAgICAgIHJldHVybiBQb3MobGluZSwgc3RhdGUuaW5kZXgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cjtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIG5leHQgd29yZC4gSWYgdGhlIGN1cnNvciBpbiB0aGUgbWlkZGxlIG9mXG4gICAgICogdGhlIHdvcmQsIHRoZW4gcmV0dXJucyB0aGUgYm91bmRhcmllcyBvZiB0aGUgY3VycmVudCB3b3JkLCBzdGFydGluZyBhdFxuICAgICAqIHRoZSBjdXJzb3IuIElmIHRoZSBjdXJzb3IgaXMgYXQgdGhlIHN0YXJ0L2VuZCBvZiBhIHdvcmQsIGFuZCB3ZSBhcmUgZ29pbmdcbiAgICAgKiBmb3J3YXJkL2JhY2t3YXJkLCByZXNwZWN0aXZlbHksIGZpbmQgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIG5leHQgd29yZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Q29kZU1pcnJvcn0gY20gQ29kZU1pcnJvciBvYmplY3QuXG4gICAgICogQHBhcmFtIHtDdXJzb3J9IGN1ciBUaGUgY3Vyc29yIHBvc2l0aW9uLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yd2FyZCBUcnVlIHRvIHNlYXJjaCBmb3J3YXJkLiBGYWxzZSB0byBzZWFyY2hcbiAgICAgKiAgICAgYmFja3dhcmQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBiaWdXb3JkIFRydWUgaWYgcHVuY3R1YXRpb24gY291bnQgYXMgcGFydCBvZiB0aGUgd29yZC5cbiAgICAgKiAgICAgRmFsc2UgaWYgb25seSBbYS16QS1aMC05XSBjaGFyYWN0ZXJzIGNvdW50IGFzIHBhcnQgb2YgdGhlIHdvcmQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbXB0eUxpbmVJc1dvcmQgVHJ1ZSBpZiBlbXB0eSBsaW5lcyBzaG91bGQgYmUgdHJlYXRlZFxuICAgICAqICAgICBhcyB3b3Jkcy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R7ZnJvbTpudW1iZXIsIHRvOm51bWJlciwgbGluZTogbnVtYmVyfX0gVGhlIGJvdW5kYXJpZXMgb2ZcbiAgICAgKiAgICAgdGhlIHdvcmQsIG9yIG51bGwgaWYgdGhlcmUgYXJlIG5vIG1vcmUgd29yZHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZFdvcmQoY20sIGN1ciwgZm9yd2FyZCwgYmlnV29yZCwgZW1wdHlMaW5lSXNXb3JkKSB7XG4gICAgICB2YXIgbGluZU51bSA9IGN1ci5saW5lO1xuICAgICAgdmFyIHBvcyA9IGN1ci5jaDtcbiAgICAgIHZhciBsaW5lID0gY20uZ2V0TGluZShsaW5lTnVtKTtcbiAgICAgIHZhciBkaXIgPSBmb3J3YXJkID8gMSA6IC0xO1xuICAgICAgdmFyIGNoYXJUZXN0cyA9IGJpZ1dvcmQgPyBiaWdXb3JkQ2hhclRlc3Q6IHdvcmRDaGFyVGVzdDtcblxuICAgICAgaWYgKGVtcHR5TGluZUlzV29yZCAmJiBsaW5lID09ICcnKSB7XG4gICAgICAgIGxpbmVOdW0gKz0gZGlyO1xuICAgICAgICBsaW5lID0gY20uZ2V0TGluZShsaW5lTnVtKTtcbiAgICAgICAgaWYgKCFpc0xpbmUoY20sIGxpbmVOdW0pKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcG9zID0gKGZvcndhcmQpID8gMCA6IGxpbmUubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpZiAoZW1wdHlMaW5lSXNXb3JkICYmIGxpbmUgPT0gJycpIHtcbiAgICAgICAgICByZXR1cm4geyBmcm9tOiAwLCB0bzogMCwgbGluZTogbGluZU51bSB9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdG9wID0gKGRpciA+IDApID8gbGluZS5sZW5ndGggOiAtMTtcbiAgICAgICAgdmFyIHdvcmRTdGFydCA9IHN0b3AsIHdvcmRFbmQgPSBzdG9wO1xuICAgICAgICAvLyBGaW5kIGJvdW5kcyBvZiBuZXh0IHdvcmQuXG4gICAgICAgIHdoaWxlIChwb3MgIT0gc3RvcCkge1xuICAgICAgICAgIHZhciBmb3VuZFdvcmQgPSBmYWxzZTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJUZXN0cy5sZW5ndGggJiYgIWZvdW5kV29yZDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoY2hhclRlc3RzW2ldKGxpbmUuY2hhckF0KHBvcykpKSB7XG4gICAgICAgICAgICAgIHdvcmRTdGFydCA9IHBvcztcbiAgICAgICAgICAgICAgLy8gQWR2YW5jZSB0byBlbmQgb2Ygd29yZC5cbiAgICAgICAgICAgICAgd2hpbGUgKHBvcyAhPSBzdG9wICYmIGNoYXJUZXN0c1tpXShsaW5lLmNoYXJBdChwb3MpKSkge1xuICAgICAgICAgICAgICAgIHBvcyArPSBkaXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgd29yZEVuZCA9IHBvcztcbiAgICAgICAgICAgICAgZm91bmRXb3JkID0gd29yZFN0YXJ0ICE9IHdvcmRFbmQ7XG4gICAgICAgICAgICAgIGlmICh3b3JkU3RhcnQgPT0gY3VyLmNoICYmIGxpbmVOdW0gPT0gY3VyLmxpbmUgJiZcbiAgICAgICAgICAgICAgICAgIHdvcmRFbmQgPT0gd29yZFN0YXJ0ICsgZGlyKSB7XG4gICAgICAgICAgICAgICAgLy8gV2Ugc3RhcnRlZCBhdCB0aGUgZW5kIG9mIGEgd29yZC4gRmluZCB0aGUgbmV4dCBvbmUuXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIGZyb206IE1hdGgubWluKHdvcmRTdGFydCwgd29yZEVuZCArIDEpLFxuICAgICAgICAgICAgICAgICAgdG86IE1hdGgubWF4KHdvcmRTdGFydCwgd29yZEVuZCksXG4gICAgICAgICAgICAgICAgICBsaW5lOiBsaW5lTnVtIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFmb3VuZFdvcmQpIHtcbiAgICAgICAgICAgIHBvcyArPSBkaXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEFkdmFuY2UgdG8gbmV4dC9wcmV2IGxpbmUuXG4gICAgICAgIGxpbmVOdW0gKz0gZGlyO1xuICAgICAgICBpZiAoIWlzTGluZShjbSwgbGluZU51bSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsaW5lID0gY20uZ2V0TGluZShsaW5lTnVtKTtcbiAgICAgICAgcG9zID0gKGRpciA+IDApID8gMCA6IGxpbmUubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q29kZU1pcnJvcn0gY20gQ29kZU1pcnJvciBvYmplY3QuXG4gICAgICogQHBhcmFtIHtQb3N9IGN1ciBUaGUgcG9zaXRpb24gdG8gc3RhcnQgZnJvbS5cbiAgICAgKiBAcGFyYW0ge2ludH0gcmVwZWF0IE51bWJlciBvZiB3b3JkcyB0byBtb3ZlIHBhc3QuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkIFRydWUgdG8gc2VhcmNoIGZvcndhcmQuIEZhbHNlIHRvIHNlYXJjaFxuICAgICAqICAgICBiYWNrd2FyZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHdvcmRFbmQgVHJ1ZSB0byBtb3ZlIHRvIGVuZCBvZiB3b3JkLiBGYWxzZSB0byBtb3ZlIHRvXG4gICAgICogICAgIGJlZ2lubmluZyBvZiB3b3JkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYmlnV29yZCBUcnVlIGlmIHB1bmN0dWF0aW9uIGNvdW50IGFzIHBhcnQgb2YgdGhlIHdvcmQuXG4gICAgICogICAgIEZhbHNlIGlmIG9ubHkgYWxwaGFiZXQgY2hhcmFjdGVycyBjb3VudCBhcyBwYXJ0IG9mIHRoZSB3b3JkLlxuICAgICAqIEByZXR1cm4ge0N1cnNvcn0gVGhlIHBvc2l0aW9uIHRoZSBjdXJzb3Igc2hvdWxkIG1vdmUgdG8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbW92ZVRvV29yZChjbSwgY3VyLCByZXBlYXQsIGZvcndhcmQsIHdvcmRFbmQsIGJpZ1dvcmQpIHtcbiAgICAgIHZhciBjdXJTdGFydCA9IGNvcHlDdXJzb3IoY3VyKTtcbiAgICAgIHZhciB3b3JkcyA9IFtdO1xuICAgICAgaWYgKGZvcndhcmQgJiYgIXdvcmRFbmQgfHwgIWZvcndhcmQgJiYgd29yZEVuZCkge1xuICAgICAgICByZXBlYXQrKztcbiAgICAgIH1cbiAgICAgIC8vIEZvciAnZScsIGVtcHR5IGxpbmVzIGFyZSBub3QgY29uc2lkZXJlZCB3b3JkcywgZ28gZmlndXJlLlxuICAgICAgdmFyIGVtcHR5TGluZUlzV29yZCA9ICEoZm9yd2FyZCAmJiB3b3JkRW5kKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgdmFyIHdvcmQgPSBmaW5kV29yZChjbSwgY3VyLCBmb3J3YXJkLCBiaWdXb3JkLCBlbXB0eUxpbmVJc1dvcmQpO1xuICAgICAgICBpZiAoIXdvcmQpIHtcbiAgICAgICAgICB2YXIgZW9kQ2ggPSBsaW5lTGVuZ3RoKGNtLCBjbS5sYXN0TGluZSgpKTtcbiAgICAgICAgICB3b3Jkcy5wdXNoKGZvcndhcmRcbiAgICAgICAgICAgICAgPyB7bGluZTogY20ubGFzdExpbmUoKSwgZnJvbTogZW9kQ2gsIHRvOiBlb2RDaH1cbiAgICAgICAgICAgICAgOiB7bGluZTogMCwgZnJvbTogMCwgdG86IDB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB3b3Jkcy5wdXNoKHdvcmQpO1xuICAgICAgICBjdXIgPSBQb3Mod29yZC5saW5lLCBmb3J3YXJkID8gKHdvcmQudG8gLSAxKSA6IHdvcmQuZnJvbSk7XG4gICAgICB9XG4gICAgICB2YXIgc2hvcnRDaXJjdWl0ID0gd29yZHMubGVuZ3RoICE9IHJlcGVhdDtcbiAgICAgIHZhciBmaXJzdFdvcmQgPSB3b3Jkc1swXTtcbiAgICAgIHZhciBsYXN0V29yZCA9IHdvcmRzLnBvcCgpO1xuICAgICAgaWYgKGZvcndhcmQgJiYgIXdvcmRFbmQpIHtcbiAgICAgICAgLy8gd1xuICAgICAgICBpZiAoIXNob3J0Q2lyY3VpdCAmJiAoZmlyc3RXb3JkLmZyb20gIT0gY3VyU3RhcnQuY2ggfHwgZmlyc3RXb3JkLmxpbmUgIT0gY3VyU3RhcnQubGluZSkpIHtcbiAgICAgICAgICAvLyBXZSBkaWQgbm90IHN0YXJ0IGluIHRoZSBtaWRkbGUgb2YgYSB3b3JkLiBEaXNjYXJkIHRoZSBleHRyYSB3b3JkIGF0IHRoZSBlbmQuXG4gICAgICAgICAgbGFzdFdvcmQgPSB3b3Jkcy5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUG9zKGxhc3RXb3JkLmxpbmUsIGxhc3RXb3JkLmZyb20pO1xuICAgICAgfSBlbHNlIGlmIChmb3J3YXJkICYmIHdvcmRFbmQpIHtcbiAgICAgICAgcmV0dXJuIFBvcyhsYXN0V29yZC5saW5lLCBsYXN0V29yZC50byAtIDEpO1xuICAgICAgfSBlbHNlIGlmICghZm9yd2FyZCAmJiB3b3JkRW5kKSB7XG4gICAgICAgIC8vIGdlXG4gICAgICAgIGlmICghc2hvcnRDaXJjdWl0ICYmIChmaXJzdFdvcmQudG8gIT0gY3VyU3RhcnQuY2ggfHwgZmlyc3RXb3JkLmxpbmUgIT0gY3VyU3RhcnQubGluZSkpIHtcbiAgICAgICAgICAvLyBXZSBkaWQgbm90IHN0YXJ0IGluIHRoZSBtaWRkbGUgb2YgYSB3b3JkLiBEaXNjYXJkIHRoZSBleHRyYSB3b3JkIGF0IHRoZSBlbmQuXG4gICAgICAgICAgbGFzdFdvcmQgPSB3b3Jkcy5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUG9zKGxhc3RXb3JkLmxpbmUsIGxhc3RXb3JkLnRvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGJcbiAgICAgICAgcmV0dXJuIFBvcyhsYXN0V29yZC5saW5lLCBsYXN0V29yZC5mcm9tKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3ZlVG9DaGFyYWN0ZXIoY20sIHJlcGVhdCwgZm9yd2FyZCwgY2hhcmFjdGVyKSB7XG4gICAgICB2YXIgY3VyID0gY20uZ2V0Q3Vyc29yKCk7XG4gICAgICB2YXIgc3RhcnQgPSBjdXIuY2g7XG4gICAgICB2YXIgaWR4O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXBlYXQ7IGkgKyspIHtcbiAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGN1ci5saW5lKTtcbiAgICAgICAgaWR4ID0gY2hhcklkeEluTGluZShzdGFydCwgbGluZSwgY2hhcmFjdGVyLCBmb3J3YXJkLCB0cnVlKTtcbiAgICAgICAgaWYgKGlkeCA9PSAtMSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gaWR4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBvcyhjbS5nZXRDdXJzb3IoKS5saW5lLCBpZHgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdmVUb0NvbHVtbihjbSwgcmVwZWF0KSB7XG4gICAgICAvLyByZXBlYXQgaXMgYWx3YXlzID49IDEsIHNvIHJlcGVhdCAtIDEgYWx3YXlzIGNvcnJlc3BvbmRzXG4gICAgICAvLyB0byB0aGUgY29sdW1uIHdlIHdhbnQgdG8gZ28gdG8uXG4gICAgICB2YXIgbGluZSA9IGNtLmdldEN1cnNvcigpLmxpbmU7XG4gICAgICByZXR1cm4gY2xpcEN1cnNvclRvQ29udGVudChjbSwgUG9zKGxpbmUsIHJlcGVhdCAtIDEpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVNYXJrKGNtLCB2aW0sIG1hcmtOYW1lLCBwb3MpIHtcbiAgICAgIGlmICghaW5BcnJheShtYXJrTmFtZSwgdmFsaWRNYXJrcykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHZpbS5tYXJrc1ttYXJrTmFtZV0pIHtcbiAgICAgICAgdmltLm1hcmtzW21hcmtOYW1lXS5jbGVhcigpO1xuICAgICAgfVxuICAgICAgdmltLm1hcmtzW21hcmtOYW1lXSA9IGNtLnNldEJvb2ttYXJrKHBvcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hhcklkeEluTGluZShzdGFydCwgbGluZSwgY2hhcmFjdGVyLCBmb3J3YXJkLCBpbmNsdWRlQ2hhcikge1xuICAgICAgLy8gU2VhcmNoIGZvciBjaGFyIGluIGxpbmUuXG4gICAgICAvLyBtb3Rpb25fb3B0aW9uczoge2ZvcndhcmQsIGluY2x1ZGVDaGFyfVxuICAgICAgLy8gSWYgaW5jbHVkZUNoYXIgPSB0cnVlLCBpbmNsdWRlIGl0IHRvby5cbiAgICAgIC8vIElmIGZvcndhcmQgPSB0cnVlLCBzZWFyY2ggZm9yd2FyZCwgZWxzZSBzZWFyY2ggYmFja3dhcmRzLlxuICAgICAgLy8gSWYgY2hhciBpcyBub3QgZm91bmQgb24gdGhpcyBsaW5lLCBkbyBub3RoaW5nXG4gICAgICB2YXIgaWR4O1xuICAgICAgaWYgKGZvcndhcmQpIHtcbiAgICAgICAgaWR4ID0gbGluZS5pbmRleE9mKGNoYXJhY3Rlciwgc3RhcnQgKyAxKTtcbiAgICAgICAgaWYgKGlkeCAhPSAtMSAmJiAhaW5jbHVkZUNoYXIpIHtcbiAgICAgICAgICBpZHggLT0gMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWR4ID0gbGluZS5sYXN0SW5kZXhPZihjaGFyYWN0ZXIsIHN0YXJ0IC0gMSk7XG4gICAgICAgIGlmIChpZHggIT0gLTEgJiYgIWluY2x1ZGVDaGFyKSB7XG4gICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpZHg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZFBhcmFncmFwaChjbSwgaGVhZCwgcmVwZWF0LCBkaXIsIGluY2x1c2l2ZSkge1xuICAgICAgdmFyIGxpbmUgPSBoZWFkLmxpbmU7XG4gICAgICB2YXIgbWluID0gY20uZmlyc3RMaW5lKCk7XG4gICAgICB2YXIgbWF4ID0gY20ubGFzdExpbmUoKTtcbiAgICAgIHZhciBzdGFydCwgZW5kLCBpID0gbGluZTtcbiAgICAgIGZ1bmN0aW9uIGlzRW1wdHkoaSkgeyByZXR1cm4gIWNtLmdldExpbmUoaSk7IH1cbiAgICAgIGZ1bmN0aW9uIGlzQm91bmRhcnkoaSwgZGlyLCBhbnkpIHtcbiAgICAgICAgaWYgKGFueSkgeyByZXR1cm4gaXNFbXB0eShpKSAhPSBpc0VtcHR5KGkgKyBkaXIpOyB9XG4gICAgICAgIHJldHVybiAhaXNFbXB0eShpKSAmJiBpc0VtcHR5KGkgKyBkaXIpO1xuICAgICAgfVxuICAgICAgaWYgKGRpcikge1xuICAgICAgICB3aGlsZSAobWluIDw9IGkgJiYgaSA8PSBtYXggJiYgcmVwZWF0ID4gMCkge1xuICAgICAgICAgIGlmIChpc0JvdW5kYXJ5KGksIGRpcikpIHsgcmVwZWF0LS07IH1cbiAgICAgICAgICBpICs9IGRpcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFBvcyhpLCAwKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgIGlmICh2aW0udmlzdWFsTGluZSAmJiBpc0JvdW5kYXJ5KGxpbmUsIDEsIHRydWUpKSB7XG4gICAgICAgIHZhciBhbmNob3IgPSB2aW0uc2VsLmFuY2hvcjtcbiAgICAgICAgaWYgKGlzQm91bmRhcnkoYW5jaG9yLmxpbmUsIC0xLCB0cnVlKSkge1xuICAgICAgICAgIGlmICghaW5jbHVzaXZlIHx8IGFuY2hvci5saW5lICE9IGxpbmUpIHtcbiAgICAgICAgICAgIGxpbmUgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBzdGFydFN0YXRlID0gaXNFbXB0eShsaW5lKTtcbiAgICAgIGZvciAoaSA9IGxpbmU7IGkgPD0gbWF4ICYmIHJlcGVhdDsgaSsrKSB7XG4gICAgICAgIGlmIChpc0JvdW5kYXJ5KGksIDEsIHRydWUpKSB7XG4gICAgICAgICAgaWYgKCFpbmNsdXNpdmUgfHwgaXNFbXB0eShpKSAhPSBzdGFydFN0YXRlKSB7XG4gICAgICAgICAgICByZXBlYXQtLTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVuZCA9IG5ldyBQb3MoaSwgMCk7XG4gICAgICAvLyBzZWxlY3QgYm91bmRhcnkgYmVmb3JlIHBhcmFncmFwaCBmb3IgdGhlIGxhc3Qgb25lXG4gICAgICBpZiAoaSA+IG1heCAmJiAhc3RhcnRTdGF0ZSkgeyBzdGFydFN0YXRlID0gdHJ1ZTsgfVxuICAgICAgZWxzZSB7IGluY2x1c2l2ZSA9IGZhbHNlOyB9XG4gICAgICBmb3IgKGkgPSBsaW5lOyBpID4gbWluOyBpLS0pIHtcbiAgICAgICAgaWYgKCFpbmNsdXNpdmUgfHwgaXNFbXB0eShpKSA9PSBzdGFydFN0YXRlIHx8IGkgPT0gbGluZSkge1xuICAgICAgICAgIGlmIChpc0JvdW5kYXJ5KGksIC0xLCB0cnVlKSkgeyBicmVhazsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdGFydCA9IG5ldyBQb3MoaSwgMCk7XG4gICAgICByZXR1cm4geyBzdGFydDogc3RhcnQsIGVuZDogZW5kIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZFNlbnRlbmNlKGNtLCBjdXIsIHJlcGVhdCwgZGlyKSB7XG5cbiAgICAgIC8qXG4gICAgICAgIFRha2VzIGFuIGluZGV4IG9iamVjdFxuICAgICAgICB7XG4gICAgICAgICAgbGluZTogdGhlIGxpbmUgc3RyaW5nLFxuICAgICAgICAgIGxuOiBsaW5lIG51bWJlcixcbiAgICAgICAgICBwb3M6IGluZGV4IGluIGxpbmUsXG4gICAgICAgICAgZGlyOiBkaXJlY3Rpb24gb2YgdHJhdmVyc2FsICgtMSBvciAxKVxuICAgICAgICB9XG4gICAgICAgIGFuZCBtb2RpZmllcyB0aGUgbGluZSwgbG4sIGFuZCBwb3MgbWVtYmVycyB0byByZXByZXNlbnQgdGhlXG4gICAgICAgIG5leHQgdmFsaWQgcG9zaXRpb24gb3Igc2V0cyB0aGVtIHRvIG51bGwgaWYgdGhlcmUgYXJlXG4gICAgICAgIG5vIG1vcmUgdmFsaWQgcG9zaXRpb25zLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBuZXh0Q2hhcihjbSwgaWR4KSB7XG4gICAgICAgIGlmIChpZHgucG9zICsgaWR4LmRpciA8IDAgfHwgaWR4LnBvcyArIGlkeC5kaXIgPj0gaWR4LmxpbmUubGVuZ3RoKSB7XG4gICAgICAgICAgaWR4LmxuICs9IGlkeC5kaXI7XG4gICAgICAgICAgaWYgKCFpc0xpbmUoY20sIGlkeC5sbikpIHtcbiAgICAgICAgICAgIGlkeC5saW5lID0gbnVsbDtcbiAgICAgICAgICAgIGlkeC5sbiA9IG51bGw7XG4gICAgICAgICAgICBpZHgucG9zID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWR4LmxpbmUgPSBjbS5nZXRMaW5lKGlkeC5sbik7XG4gICAgICAgICAgaWR4LnBvcyA9IChpZHguZGlyID4gMCkgPyAwIDogaWR4LmxpbmUubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZHgucG9zICs9IGlkeC5kaXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAgUGVyZm9ybXMgb25lIGl0ZXJhdGlvbiBvZiB0cmF2ZXJzYWwgaW4gZm9yd2FyZCBkaXJlY3Rpb25cbiAgICAgICAgUmV0dXJucyBhbiBpbmRleCBvYmplY3Qgb2YgdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBmb3J3YXJkKGNtLCBsbiwgcG9zLCBkaXIpIHtcbiAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGxuKTtcbiAgICAgICAgdmFyIHN0b3AgPSAobGluZSA9PT0gXCJcIik7XG5cbiAgICAgICAgdmFyIGN1cnIgPSB7XG4gICAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgICBsbjogbG4sXG4gICAgICAgICAgcG9zOiBwb3MsXG4gICAgICAgICAgZGlyOiBkaXIsXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGFzdF92YWxpZCA9IHtcbiAgICAgICAgICBsbjogY3Vyci5sbixcbiAgICAgICAgICBwb3M6IGN1cnIucG9zLFxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNraXBfZW1wdHlfbGluZXMgPSAoY3Vyci5saW5lID09PSBcIlwiKTtcblxuICAgICAgICAvLyBNb3ZlIG9uZSBzdGVwIHRvIHNraXAgY2hhcmFjdGVyIHdlIHN0YXJ0IG9uXG4gICAgICAgIG5leHRDaGFyKGNtLCBjdXJyKTtcblxuICAgICAgICB3aGlsZSAoY3Vyci5saW5lICE9PSBudWxsKSB7XG4gICAgICAgICAgbGFzdF92YWxpZC5sbiA9IGN1cnIubG47XG4gICAgICAgICAgbGFzdF92YWxpZC5wb3MgPSBjdXJyLnBvcztcblxuICAgICAgICAgIGlmIChjdXJyLmxpbmUgPT09IFwiXCIgJiYgIXNraXBfZW1wdHlfbGluZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGxuOiBjdXJyLmxuLCBwb3M6IGN1cnIucG9zLCB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChzdG9wICYmIGN1cnIubGluZSAhPT0gXCJcIiAmJiAhaXNXaGl0ZVNwYWNlU3RyaW5nKGN1cnIubGluZVtjdXJyLnBvc10pKSB7XG4gICAgICAgICAgICByZXR1cm4geyBsbjogY3Vyci5sbiwgcG9zOiBjdXJyLnBvcywgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoaXNFbmRPZlNlbnRlbmNlU3ltYm9sKGN1cnIubGluZVtjdXJyLnBvc10pXG4gICAgICAgICAgICAmJiAhc3RvcFxuICAgICAgICAgICAgJiYgKGN1cnIucG9zID09PSBjdXJyLmxpbmUubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICB8fCBpc1doaXRlU3BhY2VTdHJpbmcoY3Vyci5saW5lW2N1cnIucG9zICsgMV0pKSkge1xuICAgICAgICAgICAgc3RvcCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dENoYXIoY20sIGN1cnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICBTZXQgdGhlIHBvc2l0aW9uIHRvIHRoZSBsYXN0IG5vbiB3aGl0ZXNwYWNlIGNoYXJhY3RlciBvbiB0aGUgbGFzdFxuICAgICAgICAgIHZhbGlkIGxpbmUgaW4gdGhlIGNhc2UgdGhhdCB3ZSByZWFjaCB0aGUgZW5kIG9mIHRoZSBkb2N1bWVudC5cbiAgICAgICAgKi9cbiAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGxhc3RfdmFsaWQubG4pO1xuICAgICAgICBsYXN0X3ZhbGlkLnBvcyA9IDA7XG4gICAgICAgIGZvcih2YXIgaSA9IGxpbmUubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICBpZiAoIWlzV2hpdGVTcGFjZVN0cmluZyhsaW5lW2ldKSkge1xuICAgICAgICAgICAgbGFzdF92YWxpZC5wb3MgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxhc3RfdmFsaWQ7XG5cbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAgUGVyZm9ybXMgb25lIGl0ZXJhdGlvbiBvZiB0cmF2ZXJzYWwgaW4gcmV2ZXJzZSBkaXJlY3Rpb25cbiAgICAgICAgUmV0dXJucyBhbiBpbmRleCBvYmplY3Qgb2YgdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiByZXZlcnNlKGNtLCBsbiwgcG9zLCBkaXIpIHtcbiAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGxuKTtcblxuICAgICAgICB2YXIgY3VyciA9IHtcbiAgICAgICAgICBsaW5lOiBsaW5lLFxuICAgICAgICAgIGxuOiBsbixcbiAgICAgICAgICBwb3M6IHBvcyxcbiAgICAgICAgICBkaXI6IGRpcixcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsYXN0X3ZhbGlkID0ge1xuICAgICAgICAgIGxuOiBjdXJyLmxuLFxuICAgICAgICAgIHBvczogbnVsbCxcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgc2tpcF9lbXB0eV9saW5lcyA9IChjdXJyLmxpbmUgPT09IFwiXCIpO1xuXG4gICAgICAgIC8vIE1vdmUgb25lIHN0ZXAgdG8gc2tpcCBjaGFyYWN0ZXIgd2Ugc3RhcnQgb25cbiAgICAgICAgbmV4dENoYXIoY20sIGN1cnIpO1xuXG4gICAgICAgIHdoaWxlIChjdXJyLmxpbmUgIT09IG51bGwpIHtcblxuICAgICAgICAgIGlmIChjdXJyLmxpbmUgPT09IFwiXCIgJiYgIXNraXBfZW1wdHlfbGluZXMpIHtcbiAgICAgICAgICAgIGlmIChsYXN0X3ZhbGlkLnBvcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4gbGFzdF92YWxpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBsbjogY3Vyci5sbiwgcG9zOiBjdXJyLnBvcyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChpc0VuZE9mU2VudGVuY2VTeW1ib2woY3Vyci5saW5lW2N1cnIucG9zXSlcbiAgICAgICAgICAgICAgJiYgbGFzdF92YWxpZC5wb3MgIT09IG51bGxcbiAgICAgICAgICAgICAgJiYgIShjdXJyLmxuID09PSBsYXN0X3ZhbGlkLmxuICYmIGN1cnIucG9zICsgMSA9PT0gbGFzdF92YWxpZC5wb3MpKSB7XG4gICAgICAgICAgICByZXR1cm4gbGFzdF92YWxpZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoY3Vyci5saW5lICE9PSBcIlwiICYmICFpc1doaXRlU3BhY2VTdHJpbmcoY3Vyci5saW5lW2N1cnIucG9zXSkpIHtcbiAgICAgICAgICAgIHNraXBfZW1wdHlfbGluZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIGxhc3RfdmFsaWQgPSB7IGxuOiBjdXJyLmxuLCBwb3M6IGN1cnIucG9zIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0Q2hhcihjbSwgY3Vycik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgIFNldCB0aGUgcG9zaXRpb24gdG8gdGhlIGZpcnN0IG5vbiB3aGl0ZXNwYWNlIGNoYXJhY3RlciBvbiB0aGUgbGFzdFxuICAgICAgICAgIHZhbGlkIGxpbmUgaW4gdGhlIGNhc2UgdGhhdCB3ZSByZWFjaCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBkb2N1bWVudC5cbiAgICAgICAgKi9cbiAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGxhc3RfdmFsaWQubG4pO1xuICAgICAgICBsYXN0X3ZhbGlkLnBvcyA9IDA7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsaW5lLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgaWYgKCFpc1doaXRlU3BhY2VTdHJpbmcobGluZVtpXSkpIHtcbiAgICAgICAgICAgIGxhc3RfdmFsaWQucG9zID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFzdF92YWxpZDtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJfaW5kZXggPSB7XG4gICAgICAgIGxuOiBjdXIubGluZSxcbiAgICAgICAgcG9zOiBjdXIuY2gsXG4gICAgICB9O1xuXG4gICAgICB3aGlsZSAocmVwZWF0ID4gMCkge1xuICAgICAgICBpZiAoZGlyIDwgMCkge1xuICAgICAgICAgIGN1cnJfaW5kZXggPSByZXZlcnNlKGNtLCBjdXJyX2luZGV4LmxuLCBjdXJyX2luZGV4LnBvcywgZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjdXJyX2luZGV4ID0gZm9yd2FyZChjbSwgY3Vycl9pbmRleC5sbiwgY3Vycl9pbmRleC5wb3MsIGRpcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVwZWF0LS07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQb3MoY3Vycl9pbmRleC5sbiwgY3Vycl9pbmRleC5wb3MpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHBlcmhhcHMgdGhpcyBmaW5hZ2xpbmcgb2Ygc3RhcnQgYW5kIGVuZCBwb3NpdGlvbnMgYmVsb25kc1xuICAgIC8vIGluIGNvZGVtaXJyb3IvcmVwbGFjZVJhbmdlP1xuICAgIGZ1bmN0aW9uIHNlbGVjdENvbXBhbmlvbk9iamVjdChjbSwgaGVhZCwgc3ltYiwgaW5jbHVzaXZlKSB7XG4gICAgICB2YXIgY3VyID0gaGVhZCwgc3RhcnQsIGVuZDtcblxuICAgICAgdmFyIGJyYWNrZXRSZWdleHAgPSAoe1xuICAgICAgICAnKCc6IC9bKCldLywgJyknOiAvWygpXS8sXG4gICAgICAgICdbJzogL1tbXFxdXS8sICddJzogL1tbXFxdXS8sXG4gICAgICAgICd7JzogL1t7fV0vLCAnfSc6IC9be31dLyxcbiAgICAgICAgJzwnOiAvWzw+XS8sICc+JzogL1s8Pl0vfSlbc3ltYl07XG4gICAgICB2YXIgb3BlblN5bSA9ICh7XG4gICAgICAgICcoJzogJygnLCAnKSc6ICcoJyxcbiAgICAgICAgJ1snOiAnWycsICddJzogJ1snLFxuICAgICAgICAneyc6ICd7JywgJ30nOiAneycsXG4gICAgICAgICc8JzogJzwnLCAnPic6ICc8J30pW3N5bWJdO1xuICAgICAgdmFyIGN1ckNoYXIgPSBjbS5nZXRMaW5lKGN1ci5saW5lKS5jaGFyQXQoY3VyLmNoKTtcbiAgICAgIC8vIER1ZSB0byB0aGUgYmVoYXZpb3Igb2Ygc2NhbkZvckJyYWNrZXQsIHdlIG5lZWQgdG8gYWRkIGFuIG9mZnNldCBpZiB0aGVcbiAgICAgIC8vIGN1cnNvciBpcyBvbiBhIG1hdGNoaW5nIG9wZW4gYnJhY2tldC5cbiAgICAgIHZhciBvZmZzZXQgPSBjdXJDaGFyID09PSBvcGVuU3ltID8gMSA6IDA7XG5cbiAgICAgIHN0YXJ0ID0gY20uc2NhbkZvckJyYWNrZXQoUG9zKGN1ci5saW5lLCBjdXIuY2ggKyBvZmZzZXQpLCAtMSwgdW5kZWZpbmVkLCB7J2JyYWNrZXRSZWdleCc6IGJyYWNrZXRSZWdleHB9KTtcbiAgICAgIGVuZCA9IGNtLnNjYW5Gb3JCcmFja2V0KFBvcyhjdXIubGluZSwgY3VyLmNoICsgb2Zmc2V0KSwgMSwgdW5kZWZpbmVkLCB7J2JyYWNrZXRSZWdleCc6IGJyYWNrZXRSZWdleHB9KTtcblxuICAgICAgaWYgKCFzdGFydCB8fCAhZW5kKSB7XG4gICAgICAgIHJldHVybiB7IHN0YXJ0OiBjdXIsIGVuZDogY3VyIH07XG4gICAgICB9XG5cbiAgICAgIHN0YXJ0ID0gc3RhcnQucG9zO1xuICAgICAgZW5kID0gZW5kLnBvcztcblxuICAgICAgaWYgKChzdGFydC5saW5lID09IGVuZC5saW5lICYmIHN0YXJ0LmNoID4gZW5kLmNoKVxuICAgICAgICAgIHx8IChzdGFydC5saW5lID4gZW5kLmxpbmUpKSB7XG4gICAgICAgIHZhciB0bXAgPSBzdGFydDtcbiAgICAgICAgc3RhcnQgPSBlbmQ7XG4gICAgICAgIGVuZCA9IHRtcDtcbiAgICAgIH1cblxuICAgICAgaWYgKGluY2x1c2l2ZSkge1xuICAgICAgICBlbmQuY2ggKz0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0LmNoICs9IDE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IHN0YXJ0OiBzdGFydCwgZW5kOiBlbmQgfTtcbiAgICB9XG5cbiAgICAvLyBUYWtlcyBpbiBhIHN5bWJvbCBhbmQgYSBjdXJzb3IgYW5kIHRyaWVzIHRvIHNpbXVsYXRlIHRleHQgb2JqZWN0cyB0aGF0XG4gICAgLy8gaGF2ZSBpZGVudGljYWwgb3BlbmluZyBhbmQgY2xvc2luZyBzeW1ib2xzXG4gICAgLy8gVE9ETyBzdXBwb3J0IGFjcm9zcyBtdWx0aXBsZSBsaW5lc1xuICAgIGZ1bmN0aW9uIGZpbmRCZWdpbm5pbmdBbmRFbmQoY20sIGhlYWQsIHN5bWIsIGluY2x1c2l2ZSkge1xuICAgICAgdmFyIGN1ciA9IGNvcHlDdXJzb3IoaGVhZCk7XG4gICAgICB2YXIgbGluZSA9IGNtLmdldExpbmUoY3VyLmxpbmUpO1xuICAgICAgdmFyIGNoYXJzID0gbGluZS5zcGxpdCgnJyk7XG4gICAgICB2YXIgc3RhcnQsIGVuZCwgaSwgbGVuO1xuICAgICAgdmFyIGZpcnN0SW5kZXggPSBjaGFycy5pbmRleE9mKHN5bWIpO1xuXG4gICAgICAvLyB0aGUgZGVjaXNpb24gdHJlZSBpcyB0byBhbHdheXMgbG9vayBiYWNrd2FyZHMgZm9yIHRoZSBiZWdpbm5pbmcgZmlyc3QsXG4gICAgICAvLyBidXQgaWYgdGhlIGN1cnNvciBpcyBpbiBmcm9udCBvZiB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgdGhlIHN5bWIsXG4gICAgICAvLyB0aGVuIG1vdmUgdGhlIGN1cnNvciBmb3J3YXJkXG4gICAgICBpZiAoY3VyLmNoIDwgZmlyc3RJbmRleCkge1xuICAgICAgICBjdXIuY2ggPSBmaXJzdEluZGV4O1xuICAgICAgICAvLyBXaHkgaXMgdGhpcyBsaW5lIGV2ZW4gaGVyZT8/P1xuICAgICAgICAvLyBjbS5zZXRDdXJzb3IoY3VyLmxpbmUsIGZpcnN0SW5kZXgrMSk7XG4gICAgICB9XG4gICAgICAvLyBvdGhlcndpc2UgaWYgdGhlIGN1cnNvciBpcyBjdXJyZW50bHkgb24gdGhlIGNsb3Npbmcgc3ltYm9sXG4gICAgICBlbHNlIGlmIChmaXJzdEluZGV4IDwgY3VyLmNoICYmIGNoYXJzW2N1ci5jaF0gPT0gc3ltYikge1xuICAgICAgICBlbmQgPSBjdXIuY2g7IC8vIGFzc2lnbiBlbmQgdG8gdGhlIGN1cnJlbnQgY3Vyc29yXG4gICAgICAgIC0tY3VyLmNoOyAvLyBtYWtlIHN1cmUgdG8gbG9vayBiYWNrd2FyZHNcbiAgICAgIH1cblxuICAgICAgLy8gaWYgd2UncmUgY3VycmVudGx5IG9uIHRoZSBzeW1ib2wsIHdlJ3ZlIGdvdCBhIHN0YXJ0XG4gICAgICBpZiAoY2hhcnNbY3VyLmNoXSA9PSBzeW1iICYmICFlbmQpIHtcbiAgICAgICAgc3RhcnQgPSBjdXIuY2ggKyAxOyAvLyBhc3NpZ24gc3RhcnQgdG8gYWhlYWQgb2YgdGhlIGN1cnNvclxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ28gYmFja3dhcmRzIHRvIGZpbmQgdGhlIHN0YXJ0XG4gICAgICAgIGZvciAoaSA9IGN1ci5jaDsgaSA+IC0xICYmICFzdGFydDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGNoYXJzW2ldID09IHN5bWIpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGxvb2sgZm9yd2FyZHMgZm9yIHRoZSBlbmQgc3ltYm9sXG4gICAgICBpZiAoc3RhcnQgJiYgIWVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydCwgbGVuID0gY2hhcnMubGVuZ3RoOyBpIDwgbGVuICYmICFlbmQ7IGkrKykge1xuICAgICAgICAgIGlmIChjaGFyc1tpXSA9PSBzeW1iKSB7XG4gICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBub3RoaW5nIGZvdW5kXG4gICAgICBpZiAoIXN0YXJ0IHx8ICFlbmQpIHtcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQ6IGN1ciwgZW5kOiBjdXIgfTtcbiAgICAgIH1cblxuICAgICAgLy8gaW5jbHVkZSB0aGUgc3ltYm9sc1xuICAgICAgaWYgKGluY2x1c2l2ZSkge1xuICAgICAgICAtLXN0YXJ0OyArK2VuZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IFBvcyhjdXIubGluZSwgc3RhcnQpLFxuICAgICAgICBlbmQ6IFBvcyhjdXIubGluZSwgZW5kKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBTZWFyY2ggZnVuY3Rpb25zXG4gICAgZGVmaW5lT3B0aW9uKCdwY3JlJywgdHJ1ZSwgJ2Jvb2xlYW4nKTtcbiAgICBmdW5jdGlvbiBTZWFyY2hTdGF0ZSgpIHt9XG4gICAgU2VhcmNoU3RhdGUucHJvdG90eXBlID0ge1xuICAgICAgZ2V0UXVlcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmltR2xvYmFsU3RhdGUucXVlcnk7XG4gICAgICB9LFxuICAgICAgc2V0UXVlcnk6IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLnF1ZXJ5ID0gcXVlcnk7XG4gICAgICB9LFxuICAgICAgZ2V0T3ZlcmxheTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaE92ZXJsYXk7XG4gICAgICB9LFxuICAgICAgc2V0T3ZlcmxheTogZnVuY3Rpb24ob3ZlcmxheSkge1xuICAgICAgICB0aGlzLnNlYXJjaE92ZXJsYXkgPSBvdmVybGF5O1xuICAgICAgfSxcbiAgICAgIGlzUmV2ZXJzZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmltR2xvYmFsU3RhdGUuaXNSZXZlcnNlZDtcbiAgICAgIH0sXG4gICAgICBzZXRSZXZlcnNlZDogZnVuY3Rpb24ocmV2ZXJzZWQpIHtcbiAgICAgICAgdmltR2xvYmFsU3RhdGUuaXNSZXZlcnNlZCA9IHJldmVyc2VkO1xuICAgICAgfSxcbiAgICAgIGdldFNjcm9sbGJhckFubm90YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5ub3RhdGU7XG4gICAgICB9LFxuICAgICAgc2V0U2Nyb2xsYmFyQW5ub3RhdGU6IGZ1bmN0aW9uKGFubm90YXRlKSB7XG4gICAgICAgIHRoaXMuYW5ub3RhdGUgPSBhbm5vdGF0ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIGdldFNlYXJjaFN0YXRlKGNtKSB7XG4gICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgcmV0dXJuIHZpbS5zZWFyY2hTdGF0ZV8gfHwgKHZpbS5zZWFyY2hTdGF0ZV8gPSBuZXcgU2VhcmNoU3RhdGUoKSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpYWxvZyhjbSwgdGVtcGxhdGUsIHNob3J0VGV4dCwgb25DbG9zZSwgb3B0aW9ucykge1xuICAgICAgaWYgKGNtLm9wZW5EaWFsb2cpIHtcbiAgICAgICAgY20ub3BlbkRpYWxvZyh0ZW1wbGF0ZSwgb25DbG9zZSwgeyBib3R0b206IHRydWUsIHZhbHVlOiBvcHRpb25zLnZhbHVlLFxuICAgICAgICAgICAgb25LZXlEb3duOiBvcHRpb25zLm9uS2V5RG93biwgb25LZXlVcDogb3B0aW9ucy5vbktleVVwLFxuICAgICAgICAgICAgc2VsZWN0VmFsdWVPbk9wZW46IGZhbHNlfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgb25DbG9zZShwcm9tcHQoc2hvcnRUZXh0LCAnJykpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzcGxpdEJ5U2xhc2goYXJnU3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3BsaXRCeVNlcGFyYXRvcihhcmdTdHJpbmcsICcvJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZFVuZXNjYXBlZFNsYXNoZXMoYXJnU3RyaW5nKSB7XG4gICAgICByZXR1cm4gZmluZFVuZXNjYXBlZFNlcGFyYXRvcnMoYXJnU3RyaW5nLCAnLycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwbGl0QnlTZXBhcmF0b3IoYXJnU3RyaW5nLCBzZXBhcmF0b3IpIHtcbiAgICAgIHZhciBzbGFzaGVzID0gZmluZFVuZXNjYXBlZFNlcGFyYXRvcnMoYXJnU3RyaW5nLCBzZXBhcmF0b3IpIHx8IFtdO1xuICAgICAgaWYgKCFzbGFzaGVzLmxlbmd0aCkgcmV0dXJuIFtdO1xuICAgICAgdmFyIHRva2VucyA9IFtdO1xuICAgICAgLy8gaW4gY2FzZSBvZiBzdHJpbmdzIGxpa2UgZm9vL2JhclxuICAgICAgaWYgKHNsYXNoZXNbMF0gIT09IDApIHJldHVybjtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xhc2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodHlwZW9mIHNsYXNoZXNbaV0gPT0gJ251bWJlcicpXG4gICAgICAgICAgdG9rZW5zLnB1c2goYXJnU3RyaW5nLnN1YnN0cmluZyhzbGFzaGVzW2ldICsgMSwgc2xhc2hlc1tpKzFdKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRVbmVzY2FwZWRTZXBhcmF0b3JzKHN0ciwgc2VwYXJhdG9yKSB7XG4gICAgICBpZiAoIXNlcGFyYXRvcilcbiAgICAgICAgc2VwYXJhdG9yID0gJy8nO1xuXG4gICAgICB2YXIgZXNjYXBlTmV4dENoYXIgPSBmYWxzZTtcbiAgICAgIHZhciBzbGFzaGVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIGlmICghZXNjYXBlTmV4dENoYXIgJiYgYyA9PSBzZXBhcmF0b3IpIHtcbiAgICAgICAgICBzbGFzaGVzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgZXNjYXBlTmV4dENoYXIgPSAhZXNjYXBlTmV4dENoYXIgJiYgKGMgPT0gJ1xcXFwnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzbGFzaGVzO1xuICAgIH1cblxuICAgIC8vIFRyYW5zbGF0ZXMgYSBzZWFyY2ggc3RyaW5nIGZyb20gZXggKHZpbSkgc3ludGF4IGludG8gamF2YXNjcmlwdCBmb3JtLlxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZVJlZ2V4KHN0cikge1xuICAgICAgLy8gV2hlbiB0aGVzZSBtYXRjaCwgYWRkIGEgJ1xcJyBpZiB1bmVzY2FwZWQgb3IgcmVtb3ZlIG9uZSBpZiBlc2NhcGVkLlxuICAgICAgdmFyIHNwZWNpYWxzID0gJ3woKXsnO1xuICAgICAgLy8gUmVtb3ZlLCBidXQgbmV2ZXIgYWRkLCBhICdcXCcgZm9yIHRoZXNlLlxuICAgICAgdmFyIHVuZXNjYXBlID0gJ30nO1xuICAgICAgdmFyIGVzY2FwZU5leHRDaGFyID0gZmFsc2U7XG4gICAgICB2YXIgb3V0ID0gW107XG4gICAgICBmb3IgKHZhciBpID0gLTE7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KGkpIHx8ICcnO1xuICAgICAgICB2YXIgbiA9IHN0ci5jaGFyQXQoaSsxKSB8fCAnJztcbiAgICAgICAgdmFyIHNwZWNpYWxDb21lc05leHQgPSAobiAmJiBzcGVjaWFscy5pbmRleE9mKG4pICE9IC0xKTtcbiAgICAgICAgaWYgKGVzY2FwZU5leHRDaGFyKSB7XG4gICAgICAgICAgaWYgKGMgIT09ICdcXFxcJyB8fCAhc3BlY2lhbENvbWVzTmV4dCkge1xuICAgICAgICAgICAgb3V0LnB1c2goYyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVzY2FwZU5leHRDaGFyID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGMgPT09ICdcXFxcJykge1xuICAgICAgICAgICAgZXNjYXBlTmV4dENoYXIgPSB0cnVlO1xuICAgICAgICAgICAgLy8gVHJlYXQgdGhlIHVuZXNjYXBlIGxpc3QgYXMgc3BlY2lhbCBmb3IgcmVtb3ZpbmcsIGJ1dCBub3QgYWRkaW5nICdcXCcuXG4gICAgICAgICAgICBpZiAobiAmJiB1bmVzY2FwZS5pbmRleE9mKG4pICE9IC0xKSB7XG4gICAgICAgICAgICAgIHNwZWNpYWxDb21lc05leHQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTm90IHBhc3NpbmcgdGhpcyB0ZXN0IG1lYW5zIHJlbW92aW5nIGEgJ1xcJy5cbiAgICAgICAgICAgIGlmICghc3BlY2lhbENvbWVzTmV4dCB8fCBuID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgb3V0LnB1c2goYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dC5wdXNoKGMpO1xuICAgICAgICAgICAgaWYgKHNwZWNpYWxDb21lc05leHQgJiYgbiAhPT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICAgIG91dC5wdXNoKCdcXFxcJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xuICAgIH1cblxuICAgIC8vIFRyYW5zbGF0ZXMgdGhlIHJlcGxhY2UgcGFydCBvZiBhIHNlYXJjaCBhbmQgcmVwbGFjZSBmcm9tIGV4ICh2aW0pIHN5bnRheCBpbnRvXG4gICAgLy8gamF2YXNjcmlwdCBmb3JtLiAgU2ltaWxhciB0byB0cmFuc2xhdGVSZWdleCwgYnV0IGFkZGl0aW9uYWxseSBmaXhlcyBiYWNrIHJlZmVyZW5jZXNcbiAgICAvLyAodHJhbnNsYXRlcyAnXFxbMC4uOV0nIHRvICckWzAuLjldJykgYW5kIGZvbGxvd3MgZGlmZmVyZW50IHJ1bGVzIGZvciBlc2NhcGluZyAnJCcuXG4gICAgdmFyIGNoYXJVbmVzY2FwZXMgPSB7J1xcXFxuJzogJ1xcbicsICdcXFxccic6ICdcXHInLCAnXFxcXHQnOiAnXFx0J307XG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlUmVnZXhSZXBsYWNlKHN0cikge1xuICAgICAgdmFyIGVzY2FwZU5leHRDaGFyID0gZmFsc2U7XG4gICAgICB2YXIgb3V0ID0gW107XG4gICAgICBmb3IgKHZhciBpID0gLTE7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KGkpIHx8ICcnO1xuICAgICAgICB2YXIgbiA9IHN0ci5jaGFyQXQoaSsxKSB8fCAnJztcbiAgICAgICAgaWYgKGNoYXJVbmVzY2FwZXNbYyArIG5dKSB7XG4gICAgICAgICAgb3V0LnB1c2goY2hhclVuZXNjYXBlc1tjK25dKTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH0gZWxzZSBpZiAoZXNjYXBlTmV4dENoYXIpIHtcbiAgICAgICAgICAvLyBBdCBhbnkgcG9pbnQgaW4gdGhlIGxvb3AsIGVzY2FwZU5leHRDaGFyIGlzIHRydWUgaWYgdGhlIHByZXZpb3VzXG4gICAgICAgICAgLy8gY2hhcmFjdGVyIHdhcyBhICdcXCcgYW5kIHdhcyBub3QgZXNjYXBlZC5cbiAgICAgICAgICBvdXQucHVzaChjKTtcbiAgICAgICAgICBlc2NhcGVOZXh0Q2hhciA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChjID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgIGVzY2FwZU5leHRDaGFyID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICgoaXNOdW1iZXIobikgfHwgbiA9PT0gJyQnKSkge1xuICAgICAgICAgICAgICBvdXQucHVzaCgnJCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuICE9PSAnLycgJiYgbiAhPT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICAgIG91dC5wdXNoKCdcXFxcJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjID09PSAnJCcpIHtcbiAgICAgICAgICAgICAgb3V0LnB1c2goJyQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dC5wdXNoKGMpO1xuICAgICAgICAgICAgaWYgKG4gPT09ICcvJykge1xuICAgICAgICAgICAgICBvdXQucHVzaCgnXFxcXCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dC5qb2luKCcnKTtcbiAgICB9XG5cbiAgICAvLyBVbmVzY2FwZSBcXCBhbmQgLyBpbiB0aGUgcmVwbGFjZSBwYXJ0LCBmb3IgUENSRSBtb2RlLlxuICAgIHZhciB1bmVzY2FwZXMgPSB7J1xcXFwvJzogJy8nLCAnXFxcXFxcXFwnOiAnXFxcXCcsICdcXFxcbic6ICdcXG4nLCAnXFxcXHInOiAnXFxyJywgJ1xcXFx0JzogJ1xcdCcsICdcXFxcJic6JyYnfTtcbiAgICBmdW5jdGlvbiB1bmVzY2FwZVJlZ2V4UmVwbGFjZShzdHIpIHtcbiAgICAgIHZhciBzdHJlYW0gPSBuZXcgQ29kZU1pcnJvci5TdHJpbmdTdHJlYW0oc3RyKTtcbiAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgIHdoaWxlICghc3RyZWFtLmVvbCgpKSB7XG4gICAgICAgIC8vIFNlYXJjaCBmb3IgXFwuXG4gICAgICAgIHdoaWxlIChzdHJlYW0ucGVlaygpICYmIHN0cmVhbS5wZWVrKCkgIT0gJ1xcXFwnKSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2goc3RyZWFtLm5leHQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1hdGNoZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgbWF0Y2hlciBpbiB1bmVzY2FwZXMpIHtcbiAgICAgICAgICBpZiAoc3RyZWFtLm1hdGNoKG1hdGNoZXIsIHRydWUpKSB7XG4gICAgICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKHVuZXNjYXBlc1ttYXRjaGVyXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtYXRjaGVkKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgY2hhbmdlIGFueXRoaW5nXG4gICAgICAgICAgb3V0cHV0LnB1c2goc3RyZWFtLm5leHQoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCB0aGUgcmVndWxhciBleHByZXNzaW9uIGZyb20gdGhlIHF1ZXJ5IGFuZCByZXR1cm4gYSBSZWdleHAgb2JqZWN0LlxuICAgICAqIFJldHVybnMgbnVsbCBpZiB0aGUgcXVlcnkgaXMgYmxhbmsuXG4gICAgICogSWYgaWdub3JlQ2FzZSBpcyBwYXNzZWQgaW4sIHRoZSBSZWdleHAgb2JqZWN0IHdpbGwgaGF2ZSB0aGUgJ2knIGZsYWcgc2V0LlxuICAgICAqIElmIHNtYXJ0Q2FzZSBpcyBwYXNzZWQgaW4sIGFuZCB0aGUgcXVlcnkgY29udGFpbnMgdXBwZXIgY2FzZSBsZXR0ZXJzLFxuICAgICAqICAgdGhlbiBpZ25vcmVDYXNlIGlzIG92ZXJyaWRkZW4sIGFuZCB0aGUgJ2knIGZsYWcgd2lsbCBub3QgYmUgc2V0LlxuICAgICAqIElmIHRoZSBxdWVyeSBjb250YWlucyB0aGUgL2kgaW4gdGhlIGZsYWcgcGFydCBvZiB0aGUgcmVndWxhciBleHByZXNzaW9uLFxuICAgICAqICAgdGhlbiBib3RoIGlnbm9yZUNhc2UgYW5kIHNtYXJ0Q2FzZSBhcmUgaWdub3JlZCwgYW5kICdpJyB3aWxsIGJlIHBhc3NlZFxuICAgICAqICAgdGhyb3VnaCB0byB0aGUgUmVnZXggb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlUXVlcnkocXVlcnksIGlnbm9yZUNhc2UsIHNtYXJ0Q2FzZSkge1xuICAgICAgLy8gRmlyc3QgdXBkYXRlIHRoZSBsYXN0IHNlYXJjaCByZWdpc3RlclxuICAgICAgdmFyIGxhc3RTZWFyY2hSZWdpc3RlciA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5nZXRSZWdpc3RlcignLycpO1xuICAgICAgbGFzdFNlYXJjaFJlZ2lzdGVyLnNldFRleHQocXVlcnkpO1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHF1ZXJ5IGlzIGFscmVhZHkgYSByZWdleC5cbiAgICAgIGlmIChxdWVyeSBpbnN0YW5jZW9mIFJlZ0V4cCkgeyByZXR1cm4gcXVlcnk7IH1cbiAgICAgIC8vIEZpcnN0IHRyeSB0byBleHRyYWN0IHJlZ2V4ICsgZmxhZ3MgZnJvbSB0aGUgaW5wdXQuIElmIG5vIGZsYWdzIGZvdW5kLFxuICAgICAgLy8gZXh0cmFjdCBqdXN0IHRoZSByZWdleC4gSUUgZG9lcyBub3QgYWNjZXB0IGZsYWdzIGRpcmVjdGx5IGRlZmluZWQgaW5cbiAgICAgIC8vIHRoZSByZWdleCBzdHJpbmcgaW4gdGhlIGZvcm0gL3JlZ2V4L2ZsYWdzXG4gICAgICB2YXIgc2xhc2hlcyA9IGZpbmRVbmVzY2FwZWRTbGFzaGVzKHF1ZXJ5KTtcbiAgICAgIHZhciByZWdleFBhcnQ7XG4gICAgICB2YXIgZm9yY2VJZ25vcmVDYXNlO1xuICAgICAgaWYgKCFzbGFzaGVzLmxlbmd0aCkge1xuICAgICAgICAvLyBRdWVyeSBsb29rcyBsaWtlICdyZWdleHAnXG4gICAgICAgIHJlZ2V4UGFydCA9IHF1ZXJ5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUXVlcnkgbG9va3MgbGlrZSAncmVnZXhwLy4uLidcbiAgICAgICAgcmVnZXhQYXJ0ID0gcXVlcnkuc3Vic3RyaW5nKDAsIHNsYXNoZXNbMF0pO1xuICAgICAgICB2YXIgZmxhZ3NQYXJ0ID0gcXVlcnkuc3Vic3RyaW5nKHNsYXNoZXNbMF0pO1xuICAgICAgICBmb3JjZUlnbm9yZUNhc2UgPSAoZmxhZ3NQYXJ0LmluZGV4T2YoJ2knKSAhPSAtMSk7XG4gICAgICB9XG4gICAgICBpZiAoIXJlZ2V4UGFydCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICghZ2V0T3B0aW9uKCdwY3JlJykpIHtcbiAgICAgICAgcmVnZXhQYXJ0ID0gdHJhbnNsYXRlUmVnZXgocmVnZXhQYXJ0KTtcbiAgICAgIH1cbiAgICAgIGlmIChzbWFydENhc2UpIHtcbiAgICAgICAgaWdub3JlQ2FzZSA9ICgvXlteQS1aXSokLykudGVzdChyZWdleFBhcnQpO1xuICAgICAgfVxuICAgICAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAocmVnZXhQYXJ0LFxuICAgICAgICAgIChpZ25vcmVDYXNlIHx8IGZvcmNlSWdub3JlQ2FzZSkgPyAnaScgOiB1bmRlZmluZWQpO1xuICAgICAgcmV0dXJuIHJlZ2V4cDtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvd0NvbmZpcm0oY20sIHRleHQpIHtcbiAgICAgIGlmIChjbS5vcGVuTm90aWZpY2F0aW9uKSB7XG4gICAgICAgIGNtLm9wZW5Ob3RpZmljYXRpb24oJzxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZFwiPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib3R0b206IHRydWUsIGR1cmF0aW9uOiA1MDAwfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydCh0ZXh0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gbWFrZVByb21wdChwcmVmaXgsIGRlc2MpIHtcbiAgICAgIHZhciByYXcgPSAnPHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTogbW9ub3NwYWNlOyB3aGl0ZS1zcGFjZTogcHJlXCI+JyArXG4gICAgICAgICAgKHByZWZpeCB8fCBcIlwiKSArICc8aW5wdXQgdHlwZT1cInRleHRcIj48L3NwYW4+JztcbiAgICAgIGlmIChkZXNjKVxuICAgICAgICByYXcgKz0gJyA8c3BhbiBzdHlsZT1cImNvbG9yOiAjODg4XCI+JyArIGRlc2MgKyAnPC9zcGFuPic7XG4gICAgICByZXR1cm4gcmF3O1xuICAgIH1cbiAgICB2YXIgc2VhcmNoUHJvbXB0RGVzYyA9ICcoSmF2YXNjcmlwdCByZWdleHApJztcbiAgICBmdW5jdGlvbiBzaG93UHJvbXB0KGNtLCBvcHRpb25zKSB7XG4gICAgICB2YXIgc2hvcnRUZXh0ID0gKG9wdGlvbnMucHJlZml4IHx8ICcnKSArICcgJyArIChvcHRpb25zLmRlc2MgfHwgJycpO1xuICAgICAgdmFyIHByb21wdCA9IG1ha2VQcm9tcHQob3B0aW9ucy5wcmVmaXgsIG9wdGlvbnMuZGVzYyk7XG4gICAgICBkaWFsb2coY20sIHByb21wdCwgc2hvcnRUZXh0LCBvcHRpb25zLm9uQ2xvc2UsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZWdleEVxdWFsKHIxLCByMikge1xuICAgICAgaWYgKHIxIGluc3RhbmNlb2YgUmVnRXhwICYmIHIyIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgdmFyIHByb3BzID0gWydnbG9iYWwnLCAnbXVsdGlsaW5lJywgJ2lnbm9yZUNhc2UnLCAnc291cmNlJ107XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB2YXIgcHJvcCA9IHByb3BzW2ldO1xuICAgICAgICAgICAgICBpZiAocjFbcHJvcF0gIT09IHIyW3Byb3BdKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIFJldHVybnMgdHJ1ZSBpZiB0aGUgcXVlcnkgaXMgdmFsaWQuXG4gICAgZnVuY3Rpb24gdXBkYXRlU2VhcmNoUXVlcnkoY20sIHJhd1F1ZXJ5LCBpZ25vcmVDYXNlLCBzbWFydENhc2UpIHtcbiAgICAgIGlmICghcmF3UXVlcnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHN0YXRlID0gZ2V0U2VhcmNoU3RhdGUoY20pO1xuICAgICAgdmFyIHF1ZXJ5ID0gcGFyc2VRdWVyeShyYXdRdWVyeSwgISFpZ25vcmVDYXNlLCAhIXNtYXJ0Q2FzZSk7XG4gICAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGhpZ2hsaWdodFNlYXJjaE1hdGNoZXMoY20sIHF1ZXJ5KTtcbiAgICAgIGlmIChyZWdleEVxdWFsKHF1ZXJ5LCBzdGF0ZS5nZXRRdWVyeSgpKSkge1xuICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgICB9XG4gICAgICBzdGF0ZS5zZXRRdWVyeShxdWVyeSk7XG4gICAgICByZXR1cm4gcXVlcnk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNlYXJjaE92ZXJsYXkocXVlcnkpIHtcbiAgICAgIGlmIChxdWVyeS5zb3VyY2UuY2hhckF0KDApID09ICdeJykge1xuICAgICAgICB2YXIgbWF0Y2hTb2wgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9rZW46IGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgICAgICAgIGlmIChtYXRjaFNvbCAmJiAhc3RyZWFtLnNvbCgpKSB7XG4gICAgICAgICAgICBzdHJlYW0uc2tpcFRvRW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBtYXRjaCA9IHN0cmVhbS5tYXRjaChxdWVyeSwgZmFsc2UpO1xuICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgaWYgKG1hdGNoWzBdLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgIC8vIE1hdGNoZWQgZW1wdHkgc3RyaW5nLCBza2lwIHRvIG5leHQuXG4gICAgICAgICAgICAgIHN0cmVhbS5uZXh0KCk7XG4gICAgICAgICAgICAgIHJldHVybiAnc2VhcmNoaW5nJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3RyZWFtLnNvbCgpKSB7XG4gICAgICAgICAgICAgIC8vIEJhY2t0cmFjayAxIHRvIG1hdGNoIFxcYlxuICAgICAgICAgICAgICBzdHJlYW0uYmFja1VwKDEpO1xuICAgICAgICAgICAgICBpZiAoIXF1ZXJ5LmV4ZWMoc3RyZWFtLm5leHQoKSArIG1hdGNoWzBdKSkge1xuICAgICAgICAgICAgICAgIHN0cmVhbS5uZXh0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0cmVhbS5tYXRjaChxdWVyeSk7XG4gICAgICAgICAgICByZXR1cm4gJ3NlYXJjaGluZyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHdoaWxlICghc3RyZWFtLmVvbCgpKSB7XG4gICAgICAgICAgICBzdHJlYW0ubmV4dCgpO1xuICAgICAgICAgICAgaWYgKHN0cmVhbS5tYXRjaChxdWVyeSwgZmFsc2UpKSBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHF1ZXJ5OiBxdWVyeVxuICAgICAgfTtcbiAgICB9XG4gICAgdmFyIGhpZ2hsaWdodFRpbWVvdXQgPSAwO1xuICAgIGZ1bmN0aW9uIGhpZ2hsaWdodFNlYXJjaE1hdGNoZXMoY20sIHF1ZXJ5KSB7XG4gICAgICBjbGVhclRpbWVvdXQoaGlnaGxpZ2h0VGltZW91dCk7XG4gICAgICBoaWdobGlnaHRUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlYXJjaFN0YXRlID0gZ2V0U2VhcmNoU3RhdGUoY20pO1xuICAgICAgICB2YXIgb3ZlcmxheSA9IHNlYXJjaFN0YXRlLmdldE92ZXJsYXkoKTtcbiAgICAgICAgaWYgKCFvdmVybGF5IHx8IHF1ZXJ5ICE9IG92ZXJsYXkucXVlcnkpIHtcbiAgICAgICAgICBpZiAob3ZlcmxheSkge1xuICAgICAgICAgICAgY20ucmVtb3ZlT3ZlcmxheShvdmVybGF5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb3ZlcmxheSA9IHNlYXJjaE92ZXJsYXkocXVlcnkpO1xuICAgICAgICAgIGNtLmFkZE92ZXJsYXkob3ZlcmxheSk7XG4gICAgICAgICAgaWYgKGNtLnNob3dNYXRjaGVzT25TY3JvbGxiYXIpIHtcbiAgICAgICAgICAgIGlmIChzZWFyY2hTdGF0ZS5nZXRTY3JvbGxiYXJBbm5vdGF0ZSgpKSB7XG4gICAgICAgICAgICAgIHNlYXJjaFN0YXRlLmdldFNjcm9sbGJhckFubm90YXRlKCkuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlYXJjaFN0YXRlLnNldFNjcm9sbGJhckFubm90YXRlKGNtLnNob3dNYXRjaGVzT25TY3JvbGxiYXIocXVlcnkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VhcmNoU3RhdGUuc2V0T3ZlcmxheShvdmVybGF5KTtcbiAgICAgICAgfVxuICAgICAgfSwgNTApO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmaW5kTmV4dChjbSwgcHJldiwgcXVlcnksIHJlcGVhdCkge1xuICAgICAgaWYgKHJlcGVhdCA9PT0gdW5kZWZpbmVkKSB7IHJlcGVhdCA9IDE7IH1cbiAgICAgIHJldHVybiBjbS5vcGVyYXRpb24oZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwb3MgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgdmFyIGN1cnNvciA9IGNtLmdldFNlYXJjaEN1cnNvcihxdWVyeSwgcG9zKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXBlYXQ7IGkrKykge1xuICAgICAgICAgIHZhciBmb3VuZCA9IGN1cnNvci5maW5kKHByZXYpO1xuICAgICAgICAgIGlmIChpID09IDAgJiYgZm91bmQgJiYgY3Vyc29yRXF1YWwoY3Vyc29yLmZyb20oKSwgcG9zKSkgeyBmb3VuZCA9IGN1cnNvci5maW5kKHByZXYpOyB9XG4gICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgLy8gU2VhcmNoQ3Vyc29yIG1heSBoYXZlIHJldHVybmVkIG51bGwgYmVjYXVzZSBpdCBoaXQgRU9GLCB3cmFwXG4gICAgICAgICAgICAvLyBhcm91bmQgYW5kIHRyeSBhZ2Fpbi5cbiAgICAgICAgICAgIGN1cnNvciA9IGNtLmdldFNlYXJjaEN1cnNvcihxdWVyeSxcbiAgICAgICAgICAgICAgICAocHJldikgPyBQb3MoY20ubGFzdExpbmUoKSkgOiBQb3MoY20uZmlyc3RMaW5lKCksIDApICk7XG4gICAgICAgICAgICBpZiAoIWN1cnNvci5maW5kKHByZXYpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnNvci5mcm9tKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xlYXJTZWFyY2hIaWdobGlnaHQoY20pIHtcbiAgICAgIHZhciBzdGF0ZSA9IGdldFNlYXJjaFN0YXRlKGNtKTtcbiAgICAgIGNtLnJlbW92ZU92ZXJsYXkoZ2V0U2VhcmNoU3RhdGUoY20pLmdldE92ZXJsYXkoKSk7XG4gICAgICBzdGF0ZS5zZXRPdmVybGF5KG51bGwpO1xuICAgICAgaWYgKHN0YXRlLmdldFNjcm9sbGJhckFubm90YXRlKCkpIHtcbiAgICAgICAgc3RhdGUuZ2V0U2Nyb2xsYmFyQW5ub3RhdGUoKS5jbGVhcigpO1xuICAgICAgICBzdGF0ZS5zZXRTY3JvbGxiYXJBbm5vdGF0ZShudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgcG9zIGlzIGluIHRoZSBzcGVjaWZpZWQgcmFuZ2UsIElOQ0xVU0lWRS5cbiAgICAgKiBSYW5nZSBjYW4gYmUgc3BlY2lmaWVkIHdpdGggMSBvciAyIGFyZ3VtZW50cy5cbiAgICAgKiBJZiB0aGUgZmlyc3QgcmFuZ2UgYXJndW1lbnQgaXMgYW4gYXJyYXksIHRyZWF0IGl0IGFzIGFuIGFycmF5IG9mIGxpbmVcbiAgICAgKiBudW1iZXJzLiBNYXRjaCBwb3MgYWdhaW5zdCBhbnkgb2YgdGhlIGxpbmVzLlxuICAgICAqIElmIHRoZSBmaXJzdCByYW5nZSBhcmd1bWVudCBpcyBhIG51bWJlcixcbiAgICAgKiAgIGlmIHRoZXJlIGlzIG9ubHkgMSByYW5nZSBhcmd1bWVudCwgY2hlY2sgaWYgcG9zIGhhcyB0aGUgc2FtZSBsaW5lXG4gICAgICogICAgICAgbnVtYmVyXG4gICAgICogICBpZiB0aGVyZSBhcmUgMiByYW5nZSBhcmd1bWVudHMsIHRoZW4gY2hlY2sgaWYgcG9zIGlzIGluIGJldHdlZW4gdGhlIHR3b1xuICAgICAqICAgICAgIHJhbmdlIGFyZ3VtZW50cy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0luUmFuZ2UocG9zLCBzdGFydCwgZW5kKSB7XG4gICAgICBpZiAodHlwZW9mIHBvcyAhPSAnbnVtYmVyJykge1xuICAgICAgICAvLyBBc3N1bWUgaXQgaXMgYSBjdXJzb3IgcG9zaXRpb24uIEdldCB0aGUgbGluZSBudW1iZXIuXG4gICAgICAgIHBvcyA9IHBvcy5saW5lO1xuICAgICAgfVxuICAgICAgaWYgKHN0YXJ0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGluQXJyYXkocG9zLCBzdGFydCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZW5kKSB7XG4gICAgICAgICAgcmV0dXJuIChwb3MgPj0gc3RhcnQgJiYgcG9zIDw9IGVuZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHBvcyA9PSBzdGFydDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRVc2VyVmlzaWJsZUxpbmVzKGNtKSB7XG4gICAgICB2YXIgc2Nyb2xsSW5mbyA9IGNtLmdldFNjcm9sbEluZm8oKTtcbiAgICAgIHZhciBvY2NsdWRlVG9sZXJhbmNlVG9wID0gNjtcbiAgICAgIHZhciBvY2NsdWRlVG9sZXJhbmNlQm90dG9tID0gMTA7XG4gICAgICB2YXIgZnJvbSA9IGNtLmNvb3Jkc0NoYXIoe2xlZnQ6MCwgdG9wOiBvY2NsdWRlVG9sZXJhbmNlVG9wICsgc2Nyb2xsSW5mby50b3B9LCAnbG9jYWwnKTtcbiAgICAgIHZhciBib3R0b21ZID0gc2Nyb2xsSW5mby5jbGllbnRIZWlnaHQgLSBvY2NsdWRlVG9sZXJhbmNlQm90dG9tICsgc2Nyb2xsSW5mby50b3A7XG4gICAgICB2YXIgdG8gPSBjbS5jb29yZHNDaGFyKHtsZWZ0OjAsIHRvcDogYm90dG9tWX0sICdsb2NhbCcpO1xuICAgICAgcmV0dXJuIHt0b3A6IGZyb20ubGluZSwgYm90dG9tOiB0by5saW5lfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNYXJrUG9zKGNtLCB2aW0sIG1hcmtOYW1lKSB7XG4gICAgICBpZiAobWFya05hbWUgPT0gJ1xcJycpIHtcbiAgICAgICAgdmFyIGhpc3RvcnkgPSBjbS5kb2MuaGlzdG9yeS5kb25lO1xuICAgICAgICB2YXIgZXZlbnQgPSBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMl07XG4gICAgICAgIHJldHVybiBldmVudCAmJiBldmVudC5yYW5nZXMgJiYgZXZlbnQucmFuZ2VzWzBdLmhlYWQ7XG4gICAgICB9IGVsc2UgaWYgKG1hcmtOYW1lID09ICcuJykge1xuICAgICAgICBpZiAoY20uZG9jLmhpc3RvcnkubGFzdE1vZFRpbWUgPT0gMCkge1xuICAgICAgICAgIHJldHVybiAgLy8gSWYgbm8gY2hhbmdlcywgYmFpbCBvdXQ7IGRvbid0IGJvdGhlciB0byBjb3B5IG9yIHJldmVyc2UgaGlzdG9yeSBhcnJheS5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgY2hhbmdlSGlzdG9yeSA9IGNtLmRvYy5oaXN0b3J5LmRvbmUuZmlsdGVyKGZ1bmN0aW9uKGVsKXsgaWYgKGVsLmNoYW5nZXMgIT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZWwgfSB9KTtcbiAgICAgICAgICBjaGFuZ2VIaXN0b3J5LnJldmVyc2UoKTtcbiAgICAgICAgICB2YXIgbGFzdEVkaXRQb3MgPSBjaGFuZ2VIaXN0b3J5WzBdLmNoYW5nZXNbMF0udG87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhc3RFZGl0UG9zO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWFyayA9IHZpbS5tYXJrc1ttYXJrTmFtZV07XG4gICAgICByZXR1cm4gbWFyayAmJiBtYXJrLmZpbmQoKTtcbiAgICB9XG5cbiAgICB2YXIgRXhDb21tYW5kRGlzcGF0Y2hlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5idWlsZENvbW1hbmRNYXBfKCk7XG4gICAgfTtcbiAgICBFeENvbW1hbmREaXNwYXRjaGVyLnByb3RvdHlwZSA9IHtcbiAgICAgIHByb2Nlc3NDb21tYW5kOiBmdW5jdGlvbihjbSwgaW5wdXQsIG9wdF9wYXJhbXMpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBjbS5vcGVyYXRpb24oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNtLmN1ck9wLmlzVmltT3AgPSB0cnVlO1xuICAgICAgICAgIHRoYXQuX3Byb2Nlc3NDb21tYW5kKGNtLCBpbnB1dCwgb3B0X3BhcmFtcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIF9wcm9jZXNzQ29tbWFuZDogZnVuY3Rpb24oY20sIGlucHV0LCBvcHRfcGFyYW1zKSB7XG4gICAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICAgIHZhciBjb21tYW5kSGlzdG9yeVJlZ2lzdGVyID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmdldFJlZ2lzdGVyKCc6Jyk7XG4gICAgICAgIHZhciBwcmV2aW91c0NvbW1hbmQgPSBjb21tYW5kSGlzdG9yeVJlZ2lzdGVyLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIGV4aXRWaXN1YWxNb2RlKGNtKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaW5wdXRTdHJlYW0gPSBuZXcgQ29kZU1pcnJvci5TdHJpbmdTdHJlYW0oaW5wdXQpO1xuICAgICAgICAvLyB1cGRhdGUgXCI6IHdpdGggdGhlIGxhdGVzdCBjb21tYW5kIHdoZXRoZXIgdmFsaWQgb3IgaW52YWxpZFxuICAgICAgICBjb21tYW5kSGlzdG9yeVJlZ2lzdGVyLnNldFRleHQoaW5wdXQpO1xuICAgICAgICB2YXIgcGFyYW1zID0gb3B0X3BhcmFtcyB8fCB7fTtcbiAgICAgICAgcGFyYW1zLmlucHV0ID0gaW5wdXQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5wYXJzZUlucHV0XyhjbSwgaW5wdXRTdHJlYW0sIHBhcmFtcyk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgIHNob3dDb25maXJtKGNtLCBlKTtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb21tYW5kO1xuICAgICAgICB2YXIgY29tbWFuZE5hbWU7XG4gICAgICAgIGlmICghcGFyYW1zLmNvbW1hbmROYW1lKSB7XG4gICAgICAgICAgLy8gSWYgb25seSBhIGxpbmUgcmFuZ2UgaXMgZGVmaW5lZCwgbW92ZSB0byB0aGUgbGluZS5cbiAgICAgICAgICBpZiAocGFyYW1zLmxpbmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29tbWFuZE5hbWUgPSAnbW92ZSc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1hbmQgPSB0aGlzLm1hdGNoQ29tbWFuZF8ocGFyYW1zLmNvbW1hbmROYW1lKTtcbiAgICAgICAgICBpZiAoY29tbWFuZCkge1xuICAgICAgICAgICAgY29tbWFuZE5hbWUgPSBjb21tYW5kLm5hbWU7XG4gICAgICAgICAgICBpZiAoY29tbWFuZC5leGNsdWRlRnJvbUNvbW1hbmRIaXN0b3J5KSB7XG4gICAgICAgICAgICAgIGNvbW1hbmRIaXN0b3J5UmVnaXN0ZXIuc2V0VGV4dChwcmV2aW91c0NvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wYXJzZUNvbW1hbmRBcmdzXyhpbnB1dFN0cmVhbSwgcGFyYW1zLCBjb21tYW5kKTtcbiAgICAgICAgICAgIGlmIChjb21tYW5kLnR5cGUgPT0gJ2V4VG9LZXknKSB7XG4gICAgICAgICAgICAgIC8vIEhhbmRsZSBFeCB0byBLZXkgbWFwcGluZy5cbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21tYW5kLnRvS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIENvZGVNaXJyb3IuVmltLmhhbmRsZUtleShjbSwgY29tbWFuZC50b0tleXNbaV0sICdtYXBwaW5nJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLnR5cGUgPT0gJ2V4VG9FeCcpIHtcbiAgICAgICAgICAgICAgLy8gSGFuZGxlIEV4IHRvIEV4IG1hcHBpbmcuXG4gICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0NvbW1hbmQoY20sIGNvbW1hbmQudG9JbnB1dCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb21tYW5kTmFtZSkge1xuICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnTm90IGFuIGVkaXRvciBjb21tYW5kIFwiOicgKyBpbnB1dCArICdcIicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGV4Q29tbWFuZHNbY29tbWFuZE5hbWVdKGNtLCBwYXJhbXMpO1xuICAgICAgICAgIC8vIFBvc3NpYmx5IGFzeW5jaHJvbm91cyBjb21tYW5kcyAoZS5nLiBzdWJzdGl0dXRlLCB3aGljaCBtaWdodCBoYXZlIGFcbiAgICAgICAgICAvLyB1c2VyIGNvbmZpcm1hdGlvbiksIGFyZSByZXNwb25zaWJsZSBmb3IgY2FsbGluZyB0aGUgY2FsbGJhY2sgd2hlblxuICAgICAgICAgIC8vIGRvbmUuIEFsbCBvdGhlcnMgaGF2ZSBpdCB0YWtlbiBjYXJlIG9mIGZvciB0aGVtIGhlcmUuXG4gICAgICAgICAgaWYgKCghY29tbWFuZCB8fCAhY29tbWFuZC5wb3NzaWJseUFzeW5jKSAmJiBwYXJhbXMuY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHBhcmFtcy5jYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgc2hvd0NvbmZpcm0oY20sIGUpO1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwYXJzZUlucHV0XzogZnVuY3Rpb24oY20sIGlucHV0U3RyZWFtLCByZXN1bHQpIHtcbiAgICAgICAgaW5wdXRTdHJlYW0uZWF0V2hpbGUoJzonKTtcbiAgICAgICAgLy8gUGFyc2UgcmFuZ2UuXG4gICAgICAgIGlmIChpbnB1dFN0cmVhbS5lYXQoJyUnKSkge1xuICAgICAgICAgIHJlc3VsdC5saW5lID0gY20uZmlyc3RMaW5lKCk7XG4gICAgICAgICAgcmVzdWx0LmxpbmVFbmQgPSBjbS5sYXN0TGluZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdC5saW5lID0gdGhpcy5wYXJzZUxpbmVTcGVjXyhjbSwgaW5wdXRTdHJlYW0pO1xuICAgICAgICAgIGlmIChyZXN1bHQubGluZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0U3RyZWFtLmVhdCgnLCcpKSB7XG4gICAgICAgICAgICByZXN1bHQubGluZUVuZCA9IHRoaXMucGFyc2VMaW5lU3BlY18oY20sIGlucHV0U3RyZWFtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQYXJzZSBjb21tYW5kIG5hbWUuXG4gICAgICAgIHZhciBjb21tYW5kTWF0Y2ggPSBpbnB1dFN0cmVhbS5tYXRjaCgvXihcXHcrKS8pO1xuICAgICAgICBpZiAoY29tbWFuZE1hdGNoKSB7XG4gICAgICAgICAgcmVzdWx0LmNvbW1hbmROYW1lID0gY29tbWFuZE1hdGNoWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdC5jb21tYW5kTmFtZSA9IGlucHV0U3RyZWFtLm1hdGNoKC8uKi8pWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0sXG4gICAgICBwYXJzZUxpbmVTcGVjXzogZnVuY3Rpb24oY20sIGlucHV0U3RyZWFtKSB7XG4gICAgICAgIHZhciBudW1iZXJNYXRjaCA9IGlucHV0U3RyZWFtLm1hdGNoKC9eKFxcZCspLyk7XG4gICAgICAgIGlmIChudW1iZXJNYXRjaCkge1xuICAgICAgICAgIC8vIEFic29sdXRlIGxpbmUgbnVtYmVyIHBsdXMgb2Zmc2V0IChOK00gb3IgTi1NKSBpcyBwcm9iYWJseSBhIHR5cG8sXG4gICAgICAgICAgLy8gbm90IHNvbWV0aGluZyB0aGUgdXNlciBhY3R1YWxseSB3YW50ZWQuIChOQjogdmltIGRvZXMgYWxsb3cgdGhpcy4pXG4gICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG51bWJlck1hdGNoWzFdLCAxMCkgLSAxO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoaW5wdXRTdHJlYW0ubmV4dCgpKSB7XG4gICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxpbmVTcGVjT2Zmc2V0XyhpbnB1dFN0cmVhbSwgY20uZ2V0Q3Vyc29yKCkubGluZSk7XG4gICAgICAgICAgY2FzZSAnJCc6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxpbmVTcGVjT2Zmc2V0XyhpbnB1dFN0cmVhbSwgY20ubGFzdExpbmUoKSk7XG4gICAgICAgICAgY2FzZSAnXFwnJzpcbiAgICAgICAgICAgIHZhciBtYXJrTmFtZSA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgICAgICAgICAgIHZhciBtYXJrUG9zID0gZ2V0TWFya1BvcyhjbSwgY20uc3RhdGUudmltLCBtYXJrTmFtZSk7XG4gICAgICAgICAgICBpZiAoIW1hcmtQb3MpIHRocm93IG5ldyBFcnJvcignTWFyayBub3Qgc2V0Jyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxpbmVTcGVjT2Zmc2V0XyhpbnB1dFN0cmVhbSwgbWFya1Bvcy5saW5lKTtcbiAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgIGlucHV0U3RyZWFtLmJhY2tVcCgxKTtcbiAgICAgICAgICAgIC8vIE9mZnNldCBpcyByZWxhdGl2ZSB0byBjdXJyZW50IGxpbmUgaWYgbm90IG90aGVyd2lzZSBzcGVjaWZpZWQuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxpbmVTcGVjT2Zmc2V0XyhpbnB1dFN0cmVhbSwgY20uZ2V0Q3Vyc29yKCkubGluZSk7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlucHV0U3RyZWFtLmJhY2tVcCgxKTtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwYXJzZUxpbmVTcGVjT2Zmc2V0XzogZnVuY3Rpb24oaW5wdXRTdHJlYW0sIGxpbmUpIHtcbiAgICAgICAgdmFyIG9mZnNldE1hdGNoID0gaW5wdXRTdHJlYW0ubWF0Y2goL14oWystXSk/KFxcZCspLyk7XG4gICAgICAgIGlmIChvZmZzZXRNYXRjaCkge1xuICAgICAgICAgIHZhciBvZmZzZXQgPSBwYXJzZUludChvZmZzZXRNYXRjaFsyXSwgMTApO1xuICAgICAgICAgIGlmIChvZmZzZXRNYXRjaFsxXSA9PSBcIi1cIikge1xuICAgICAgICAgICAgbGluZSAtPSBvZmZzZXQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpbmUgKz0gb2Zmc2V0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGluZTtcbiAgICAgIH0sXG4gICAgICBwYXJzZUNvbW1hbmRBcmdzXzogZnVuY3Rpb24oaW5wdXRTdHJlYW0sIHBhcmFtcywgY29tbWFuZCkge1xuICAgICAgICBpZiAoaW5wdXRTdHJlYW0uZW9sKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcGFyYW1zLmFyZ1N0cmluZyA9IGlucHV0U3RyZWFtLm1hdGNoKC8uKi8pWzBdO1xuICAgICAgICAvLyBQYXJzZSBjb21tYW5kLWxpbmUgYXJndW1lbnRzXG4gICAgICAgIHZhciBkZWxpbSA9IGNvbW1hbmQuYXJnRGVsaW1pdGVyIHx8IC9cXHMrLztcbiAgICAgICAgdmFyIGFyZ3MgPSB0cmltKHBhcmFtcy5hcmdTdHJpbmcpLnNwbGl0KGRlbGltKTtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICYmIGFyZ3NbMF0pIHtcbiAgICAgICAgICBwYXJhbXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBtYXRjaENvbW1hbmRfOiBmdW5jdGlvbihjb21tYW5kTmFtZSkge1xuICAgICAgICAvLyBSZXR1cm4gdGhlIGNvbW1hbmQgaW4gdGhlIGNvbW1hbmQgbWFwIHRoYXQgbWF0Y2hlcyB0aGUgc2hvcnRlc3RcbiAgICAgICAgLy8gcHJlZml4IG9mIHRoZSBwYXNzZWQgaW4gY29tbWFuZCBuYW1lLiBUaGUgbWF0Y2ggaXMgZ3VhcmFudGVlZCB0byBiZVxuICAgICAgICAvLyB1bmFtYmlndW91cyBpZiB0aGUgZGVmYXVsdEV4Q29tbWFuZE1hcCdzIHNob3J0TmFtZXMgYXJlIHNldCB1cFxuICAgICAgICAvLyBjb3JyZWN0bHkuIChzZWUgQGNvZGV7ZGVmYXVsdEV4Q29tbWFuZE1hcH0pLlxuICAgICAgICBmb3IgKHZhciBpID0gY29tbWFuZE5hbWUubGVuZ3RoOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgdmFyIHByZWZpeCA9IGNvbW1hbmROYW1lLnN1YnN0cmluZygwLCBpKTtcbiAgICAgICAgICBpZiAodGhpcy5jb21tYW5kTWFwX1twcmVmaXhdKSB7XG4gICAgICAgICAgICB2YXIgY29tbWFuZCA9IHRoaXMuY29tbWFuZE1hcF9bcHJlZml4XTtcbiAgICAgICAgICAgIGlmIChjb21tYW5kLm5hbWUuaW5kZXhPZihjb21tYW5kTmFtZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSxcbiAgICAgIGJ1aWxkQ29tbWFuZE1hcF86IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvbW1hbmRNYXBfID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVmYXVsdEV4Q29tbWFuZE1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBjb21tYW5kID0gZGVmYXVsdEV4Q29tbWFuZE1hcFtpXTtcbiAgICAgICAgICB2YXIga2V5ID0gY29tbWFuZC5zaG9ydE5hbWUgfHwgY29tbWFuZC5uYW1lO1xuICAgICAgICAgIHRoaXMuY29tbWFuZE1hcF9ba2V5XSA9IGNvbW1hbmQ7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBtYXA6IGZ1bmN0aW9uKGxocywgcmhzLCBjdHgpIHtcbiAgICAgICAgaWYgKGxocyAhPSAnOicgJiYgbGhzLmNoYXJBdCgwKSA9PSAnOicpIHtcbiAgICAgICAgICBpZiAoY3R4KSB7IHRocm93IEVycm9yKCdNb2RlIG5vdCBzdXBwb3J0ZWQgZm9yIGV4IG1hcHBpbmdzJyk7IH1cbiAgICAgICAgICB2YXIgY29tbWFuZE5hbWUgPSBsaHMuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgIGlmIChyaHMgIT0gJzonICYmIHJocy5jaGFyQXQoMCkgPT0gJzonKSB7XG4gICAgICAgICAgICAvLyBFeCB0byBFeCBtYXBwaW5nXG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRNYXBfW2NvbW1hbmROYW1lXSA9IHtcbiAgICAgICAgICAgICAgbmFtZTogY29tbWFuZE5hbWUsXG4gICAgICAgICAgICAgIHR5cGU6ICdleFRvRXgnLFxuICAgICAgICAgICAgICB0b0lucHV0OiByaHMuc3Vic3RyaW5nKDEpLFxuICAgICAgICAgICAgICB1c2VyOiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBFeCB0byBrZXkgbWFwcGluZ1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kTWFwX1tjb21tYW5kTmFtZV0gPSB7XG4gICAgICAgICAgICAgIG5hbWU6IGNvbW1hbmROYW1lLFxuICAgICAgICAgICAgICB0eXBlOiAnZXhUb0tleScsXG4gICAgICAgICAgICAgIHRvS2V5czogcmhzLFxuICAgICAgICAgICAgICB1c2VyOiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmhzICE9ICc6JyAmJiByaHMuY2hhckF0KDApID09ICc6Jykge1xuICAgICAgICAgICAgLy8gS2V5IHRvIEV4IG1hcHBpbmcuXG4gICAgICAgICAgICB2YXIgbWFwcGluZyA9IHtcbiAgICAgICAgICAgICAga2V5czogbGhzLFxuICAgICAgICAgICAgICB0eXBlOiAna2V5VG9FeCcsXG4gICAgICAgICAgICAgIGV4QXJnczogeyBpbnB1dDogcmhzLnN1YnN0cmluZygxKSB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGN0eCkgeyBtYXBwaW5nLmNvbnRleHQgPSBjdHg7IH1cbiAgICAgICAgICAgIGRlZmF1bHRLZXltYXAudW5zaGlmdChtYXBwaW5nKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gS2V5IHRvIGtleSBtYXBwaW5nXG4gICAgICAgICAgICB2YXIgbWFwcGluZyA9IHtcbiAgICAgICAgICAgICAga2V5czogbGhzLFxuICAgICAgICAgICAgICB0eXBlOiAna2V5VG9LZXknLFxuICAgICAgICAgICAgICB0b0tleXM6IHJoc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChjdHgpIHsgbWFwcGluZy5jb250ZXh0ID0gY3R4OyB9XG4gICAgICAgICAgICBkZWZhdWx0S2V5bWFwLnVuc2hpZnQobWFwcGluZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdW5tYXA6IGZ1bmN0aW9uKGxocywgY3R4KSB7XG4gICAgICAgIGlmIChsaHMgIT0gJzonICYmIGxocy5jaGFyQXQoMCkgPT0gJzonKSB7XG4gICAgICAgICAgLy8gRXggdG8gRXggb3IgRXggdG8ga2V5IG1hcHBpbmdcbiAgICAgICAgICBpZiAoY3R4KSB7IHRocm93IEVycm9yKCdNb2RlIG5vdCBzdXBwb3J0ZWQgZm9yIGV4IG1hcHBpbmdzJyk7IH1cbiAgICAgICAgICB2YXIgY29tbWFuZE5hbWUgPSBsaHMuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgIGlmICh0aGlzLmNvbW1hbmRNYXBfW2NvbW1hbmROYW1lXSAmJiB0aGlzLmNvbW1hbmRNYXBfW2NvbW1hbmROYW1lXS51c2VyKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jb21tYW5kTWFwX1tjb21tYW5kTmFtZV07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEtleSB0byBFeCBvciBrZXkgdG8ga2V5IG1hcHBpbmdcbiAgICAgICAgICB2YXIga2V5cyA9IGxocztcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlZmF1bHRLZXltYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChrZXlzID09IGRlZmF1bHRLZXltYXBbaV0ua2V5c1xuICAgICAgICAgICAgICAgICYmIGRlZmF1bHRLZXltYXBbaV0uY29udGV4dCA9PT0gY3R4KSB7XG4gICAgICAgICAgICAgIGRlZmF1bHRLZXltYXAuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93IEVycm9yKCdObyBzdWNoIG1hcHBpbmcuJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBleENvbW1hbmRzID0ge1xuICAgICAgY29sb3JzY2hlbWU6IGZ1bmN0aW9uKGNtLCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKCFwYXJhbXMuYXJncyB8fCBwYXJhbXMuYXJncy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgc2hvd0NvbmZpcm0oY20sIGNtLmdldE9wdGlvbigndGhlbWUnKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNtLnNldE9wdGlvbigndGhlbWUnLCBwYXJhbXMuYXJnc1swXSk7XG4gICAgICB9LFxuICAgICAgbWFwOiBmdW5jdGlvbihjbSwgcGFyYW1zLCBjdHgpIHtcbiAgICAgICAgdmFyIG1hcEFyZ3MgPSBwYXJhbXMuYXJncztcbiAgICAgICAgaWYgKCFtYXBBcmdzIHx8IG1hcEFyZ3MubGVuZ3RoIDwgMikge1xuICAgICAgICAgIGlmIChjbSkge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdJbnZhbGlkIG1hcHBpbmc6ICcgKyBwYXJhbXMuaW5wdXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXhDb21tYW5kRGlzcGF0Y2hlci5tYXAobWFwQXJnc1swXSwgbWFwQXJnc1sxXSwgY3R4KTtcbiAgICAgIH0sXG4gICAgICBpbWFwOiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7IHRoaXMubWFwKGNtLCBwYXJhbXMsICdpbnNlcnQnKTsgfSxcbiAgICAgIG5tYXA6IGZ1bmN0aW9uKGNtLCBwYXJhbXMpIHsgdGhpcy5tYXAoY20sIHBhcmFtcywgJ25vcm1hbCcpOyB9LFxuICAgICAgdm1hcDogZnVuY3Rpb24oY20sIHBhcmFtcykgeyB0aGlzLm1hcChjbSwgcGFyYW1zLCAndmlzdWFsJyk7IH0sXG4gICAgICB1bm1hcDogZnVuY3Rpb24oY20sIHBhcmFtcywgY3R4KSB7XG4gICAgICAgIHZhciBtYXBBcmdzID0gcGFyYW1zLmFyZ3M7XG4gICAgICAgIGlmICghbWFwQXJncyB8fCBtYXBBcmdzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICBpZiAoY20pIHtcbiAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnTm8gc3VjaCBtYXBwaW5nOiAnICsgcGFyYW1zLmlucHV0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV4Q29tbWFuZERpc3BhdGNoZXIudW5tYXAobWFwQXJnc1swXSwgY3R4KTtcbiAgICAgIH0sXG4gICAgICBtb3ZlOiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7XG4gICAgICAgIGNvbW1hbmREaXNwYXRjaGVyLnByb2Nlc3NDb21tYW5kKGNtLCBjbS5zdGF0ZS52aW0sIHtcbiAgICAgICAgICAgIHR5cGU6ICdtb3Rpb24nLFxuICAgICAgICAgICAgbW90aW9uOiAnbW92ZVRvTGluZU9yRWRnZU9mRG9jdW1lbnQnLFxuICAgICAgICAgICAgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgZXhwbGljaXRSZXBlYXQ6IHRydWUsXG4gICAgICAgICAgICAgIGxpbmV3aXNlOiB0cnVlIH0sXG4gICAgICAgICAgICByZXBlYXRPdmVycmlkZTogcGFyYW1zLmxpbmUrMX0pO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24oY20sIHBhcmFtcykge1xuICAgICAgICB2YXIgc2V0QXJncyA9IHBhcmFtcy5hcmdzO1xuICAgICAgICAvLyBPcHRpb25zIHBhc3NlZCB0aHJvdWdoIHRvIHRoZSBzZXRPcHRpb24vZ2V0T3B0aW9uIGNhbGxzLiBNYXkgYmUgcGFzc2VkIGluIGJ5IHRoZVxuICAgICAgICAvLyBsb2NhbC9nbG9iYWwgdmVyc2lvbnMgb2YgdGhlIHNldCBjb21tYW5kXG4gICAgICAgIHZhciBzZXRDZmcgPSBwYXJhbXMuc2V0Q2ZnIHx8IHt9O1xuICAgICAgICBpZiAoIXNldEFyZ3MgfHwgc2V0QXJncy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgaWYgKGNtKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0ludmFsaWQgbWFwcGluZzogJyArIHBhcmFtcy5pbnB1dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXhwciA9IHNldEFyZ3NbMF0uc3BsaXQoJz0nKTtcbiAgICAgICAgdmFyIG9wdGlvbk5hbWUgPSBleHByWzBdO1xuICAgICAgICB2YXIgdmFsdWUgPSBleHByWzFdO1xuICAgICAgICB2YXIgZm9yY2VHZXQgPSBmYWxzZTtcblxuICAgICAgICBpZiAob3B0aW9uTmFtZS5jaGFyQXQob3B0aW9uTmFtZS5sZW5ndGggLSAxKSA9PSAnPycpIHtcbiAgICAgICAgICAvLyBJZiBwb3N0LWZpeGVkIHdpdGggPywgdGhlbiB0aGUgc2V0IGlzIGFjdHVhbGx5IGEgZ2V0LlxuICAgICAgICAgIGlmICh2YWx1ZSkgeyB0aHJvdyBFcnJvcignVHJhaWxpbmcgY2hhcmFjdGVyczogJyArIHBhcmFtcy5hcmdTdHJpbmcpOyB9XG4gICAgICAgICAgb3B0aW9uTmFtZSA9IG9wdGlvbk5hbWUuc3Vic3RyaW5nKDAsIG9wdGlvbk5hbWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgZm9yY2VHZXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9wdGlvbk5hbWUuc3Vic3RyaW5nKDAsIDIpID09ICdubycpIHtcbiAgICAgICAgICAvLyBUbyBzZXQgYm9vbGVhbiBvcHRpb25zIHRvIGZhbHNlLCB0aGUgb3B0aW9uIG5hbWUgaXMgcHJlZml4ZWQgd2l0aFxuICAgICAgICAgIC8vICdubycuXG4gICAgICAgICAgb3B0aW9uTmFtZSA9IG9wdGlvbk5hbWUuc3Vic3RyaW5nKDIpO1xuICAgICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3B0aW9uSXNCb29sZWFuID0gb3B0aW9uc1tvcHRpb25OYW1lXSAmJiBvcHRpb25zW29wdGlvbk5hbWVdLnR5cGUgPT0gJ2Jvb2xlYW4nO1xuICAgICAgICBpZiAob3B0aW9uSXNCb29sZWFuICYmIHZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIENhbGxpbmcgc2V0IHdpdGggYSBib29sZWFuIG9wdGlvbiBzZXRzIGl0IHRvIHRydWUuXG4gICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIG5vIHZhbHVlIGlzIHByb3ZpZGVkLCB0aGVuIHdlIGFzc3VtZSB0aGlzIGlzIGEgZ2V0LlxuICAgICAgICBpZiAoIW9wdGlvbklzQm9vbGVhbiAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGZvcmNlR2V0KSB7XG4gICAgICAgICAgdmFyIG9sZFZhbHVlID0gZ2V0T3B0aW9uKG9wdGlvbk5hbWUsIGNtLCBzZXRDZmcpO1xuICAgICAgICAgIGlmIChvbGRWYWx1ZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgb2xkVmFsdWUubWVzc2FnZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvbGRWYWx1ZSA9PT0gdHJ1ZSB8fCBvbGRWYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnICcgKyAob2xkVmFsdWUgPyAnJyA6ICdubycpICsgb3B0aW9uTmFtZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnICAnICsgb3B0aW9uTmFtZSArICc9JyArIG9sZFZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNldE9wdGlvblJldHVybiA9IHNldE9wdGlvbihvcHRpb25OYW1lLCB2YWx1ZSwgY20sIHNldENmZyk7XG4gICAgICAgICAgaWYgKHNldE9wdGlvblJldHVybiBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgc2V0T3B0aW9uUmV0dXJuLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNldGxvY2FsOiBmdW5jdGlvbiAoY20sIHBhcmFtcykge1xuICAgICAgICAvLyBzZXRDZmcgaXMgcGFzc2VkIHRocm91Z2ggdG8gc2V0T3B0aW9uXG4gICAgICAgIHBhcmFtcy5zZXRDZmcgPSB7c2NvcGU6ICdsb2NhbCd9O1xuICAgICAgICB0aGlzLnNldChjbSwgcGFyYW1zKTtcbiAgICAgIH0sXG4gICAgICBzZXRnbG9iYWw6IGZ1bmN0aW9uIChjbSwgcGFyYW1zKSB7XG4gICAgICAgIC8vIHNldENmZyBpcyBwYXNzZWQgdGhyb3VnaCB0byBzZXRPcHRpb25cbiAgICAgICAgcGFyYW1zLnNldENmZyA9IHtzY29wZTogJ2dsb2JhbCd9O1xuICAgICAgICB0aGlzLnNldChjbSwgcGFyYW1zKTtcbiAgICAgIH0sXG4gICAgICByZWdpc3RlcnM6IGZ1bmN0aW9uKGNtLCBwYXJhbXMpIHtcbiAgICAgICAgdmFyIHJlZ0FyZ3MgPSBwYXJhbXMuYXJncztcbiAgICAgICAgdmFyIHJlZ2lzdGVycyA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5yZWdpc3RlcnM7XG4gICAgICAgIHZhciByZWdJbmZvID0gJy0tLS0tLS0tLS1SZWdpc3RlcnMtLS0tLS0tLS0tPGJyPjxicj4nO1xuICAgICAgICBpZiAoIXJlZ0FyZ3MpIHtcbiAgICAgICAgICBmb3IgKHZhciByZWdpc3Rlck5hbWUgaW4gcmVnaXN0ZXJzKSB7XG4gICAgICAgICAgICB2YXIgdGV4dCA9IHJlZ2lzdGVyc1tyZWdpc3Rlck5hbWVdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmVnSW5mbyArPSAnXCInICsgcmVnaXN0ZXJOYW1lICsgJyAgICAnICsgdGV4dCArICc8YnI+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHJlZ2lzdGVyTmFtZTtcbiAgICAgICAgICByZWdBcmdzID0gcmVnQXJncy5qb2luKCcnKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZ0FyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlZ2lzdGVyTmFtZSA9IHJlZ0FyZ3MuY2hhckF0KGkpO1xuICAgICAgICAgICAgaWYgKCF2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIuaXNWYWxpZFJlZ2lzdGVyKHJlZ2lzdGVyTmFtZSkpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVnaXN0ZXIgPSByZWdpc3RlcnNbcmVnaXN0ZXJOYW1lXSB8fCBuZXcgUmVnaXN0ZXIoKTtcbiAgICAgICAgICAgIHJlZ0luZm8gKz0gJ1wiJyArIHJlZ2lzdGVyTmFtZSArICcgICAgJyArIHJlZ2lzdGVyLnRvU3RyaW5nKCkgKyAnPGJyPic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNob3dDb25maXJtKGNtLCByZWdJbmZvKTtcbiAgICAgIH0sXG4gICAgICBzb3J0OiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7XG4gICAgICAgIHZhciByZXZlcnNlLCBpZ25vcmVDYXNlLCB1bmlxdWUsIG51bWJlciwgcGF0dGVybjtcbiAgICAgICAgZnVuY3Rpb24gcGFyc2VBcmdzKCkge1xuICAgICAgICAgIGlmIChwYXJhbXMuYXJnU3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IG5ldyBDb2RlTWlycm9yLlN0cmluZ1N0cmVhbShwYXJhbXMuYXJnU3RyaW5nKTtcbiAgICAgICAgICAgIGlmIChhcmdzLmVhdCgnIScpKSB7IHJldmVyc2UgPSB0cnVlOyB9XG4gICAgICAgICAgICBpZiAoYXJncy5lb2woKSkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIGlmICghYXJncy5lYXRTcGFjZSgpKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudHMnOyB9XG4gICAgICAgICAgICB2YXIgb3B0cyA9IGFyZ3MubWF0Y2goLyhbZGludW94XSspP1xccyooXFwvLitcXC8pP1xccyovKTtcbiAgICAgICAgICAgIGlmICghb3B0cyAmJiAhYXJncy5lb2woKSkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnRzJzsgfVxuICAgICAgICAgICAgaWYgKG9wdHNbMV0pIHtcbiAgICAgICAgICAgICAgaWdub3JlQ2FzZSA9IG9wdHNbMV0uaW5kZXhPZignaScpICE9IC0xO1xuICAgICAgICAgICAgICB1bmlxdWUgPSBvcHRzWzFdLmluZGV4T2YoJ3UnKSAhPSAtMTtcbiAgICAgICAgICAgICAgdmFyIGRlY2ltYWwgPSBvcHRzWzFdLmluZGV4T2YoJ2QnKSAhPSAtMSB8fCBvcHRzWzFdLmluZGV4T2YoJ24nKSAhPSAtMSAmJiAxO1xuICAgICAgICAgICAgICB2YXIgaGV4ID0gb3B0c1sxXS5pbmRleE9mKCd4JykgIT0gLTEgJiYgMTtcbiAgICAgICAgICAgICAgdmFyIG9jdGFsID0gb3B0c1sxXS5pbmRleE9mKCdvJykgIT0gLTEgJiYgMTtcbiAgICAgICAgICAgICAgaWYgKGRlY2ltYWwgKyBoZXggKyBvY3RhbCA+IDEpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50cyc7IH1cbiAgICAgICAgICAgICAgbnVtYmVyID0gZGVjaW1hbCAmJiAnZGVjaW1hbCcgfHwgaGV4ICYmICdoZXgnIHx8IG9jdGFsICYmICdvY3RhbCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0c1syXSkge1xuICAgICAgICAgICAgICBwYXR0ZXJuID0gbmV3IFJlZ0V4cChvcHRzWzJdLnN1YnN0cigxLCBvcHRzWzJdLmxlbmd0aCAtIDIpLCBpZ25vcmVDYXNlID8gJ2knIDogJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZXJyID0gcGFyc2VBcmdzKCk7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBzaG93Q29uZmlybShjbSwgZXJyICsgJzogJyArIHBhcmFtcy5hcmdTdHJpbmcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGluZVN0YXJ0ID0gcGFyYW1zLmxpbmUgfHwgY20uZmlyc3RMaW5lKCk7XG4gICAgICAgIHZhciBsaW5lRW5kID0gcGFyYW1zLmxpbmVFbmQgfHwgcGFyYW1zLmxpbmUgfHwgY20ubGFzdExpbmUoKTtcbiAgICAgICAgaWYgKGxpbmVTdGFydCA9PSBsaW5lRW5kKSB7IHJldHVybjsgfVxuICAgICAgICB2YXIgY3VyU3RhcnQgPSBQb3MobGluZVN0YXJ0LCAwKTtcbiAgICAgICAgdmFyIGN1ckVuZCA9IFBvcyhsaW5lRW5kLCBsaW5lTGVuZ3RoKGNtLCBsaW5lRW5kKSk7XG4gICAgICAgIHZhciB0ZXh0ID0gY20uZ2V0UmFuZ2UoY3VyU3RhcnQsIGN1ckVuZCkuc3BsaXQoJ1xcbicpO1xuICAgICAgICB2YXIgbnVtYmVyUmVnZXggPSBwYXR0ZXJuID8gcGF0dGVybiA6XG4gICAgICAgICAgIChudW1iZXIgPT0gJ2RlY2ltYWwnKSA/IC8oLT8pKFtcXGRdKykvIDpcbiAgICAgICAgICAgKG51bWJlciA9PSAnaGV4JykgPyAvKC0/KSg/OjB4KT8oWzAtOWEtZl0rKS9pIDpcbiAgICAgICAgICAgKG51bWJlciA9PSAnb2N0YWwnKSA/IC8oWzAtN10rKS8gOiBudWxsO1xuICAgICAgICB2YXIgcmFkaXggPSAobnVtYmVyID09ICdkZWNpbWFsJykgPyAxMCA6IChudW1iZXIgPT0gJ2hleCcpID8gMTYgOiAobnVtYmVyID09ICdvY3RhbCcpID8gOCA6IG51bGw7XG4gICAgICAgIHZhciBudW1QYXJ0ID0gW10sIHRleHRQYXJ0ID0gW107XG4gICAgICAgIGlmIChudW1iZXIgfHwgcGF0dGVybikge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG1hdGNoUGFydCA9IHBhdHRlcm4gPyB0ZXh0W2ldLm1hdGNoKHBhdHRlcm4pIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChtYXRjaFBhcnQgJiYgbWF0Y2hQYXJ0WzBdICE9ICcnKSB7XG4gICAgICAgICAgICAgIG51bVBhcnQucHVzaChtYXRjaFBhcnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghcGF0dGVybiAmJiBudW1iZXJSZWdleC5leGVjKHRleHRbaV0pKSB7XG4gICAgICAgICAgICAgIG51bVBhcnQucHVzaCh0ZXh0W2ldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHRQYXJ0LnB1c2godGV4dFtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHRQYXJ0ID0gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb21wYXJlRm4oYSwgYikge1xuICAgICAgICAgIGlmIChyZXZlcnNlKSB7IHZhciB0bXA7IHRtcCA9IGE7IGEgPSBiOyBiID0gdG1wOyB9XG4gICAgICAgICAgaWYgKGlnbm9yZUNhc2UpIHsgYSA9IGEudG9Mb3dlckNhc2UoKTsgYiA9IGIudG9Mb3dlckNhc2UoKTsgfVxuICAgICAgICAgIHZhciBhbnVtID0gbnVtYmVyICYmIG51bWJlclJlZ2V4LmV4ZWMoYSk7XG4gICAgICAgICAgdmFyIGJudW0gPSBudW1iZXIgJiYgbnVtYmVyUmVnZXguZXhlYyhiKTtcbiAgICAgICAgICBpZiAoIWFudW0pIHsgcmV0dXJuIGEgPCBiID8gLTEgOiAxOyB9XG4gICAgICAgICAgYW51bSA9IHBhcnNlSW50KChhbnVtWzFdICsgYW51bVsyXSkudG9Mb3dlckNhc2UoKSwgcmFkaXgpO1xuICAgICAgICAgIGJudW0gPSBwYXJzZUludCgoYm51bVsxXSArIGJudW1bMl0pLnRvTG93ZXJDYXNlKCksIHJhZGl4KTtcbiAgICAgICAgICByZXR1cm4gYW51bSAtIGJudW07XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY29tcGFyZVBhdHRlcm5GbihhLCBiKSB7XG4gICAgICAgICAgaWYgKHJldmVyc2UpIHsgdmFyIHRtcDsgdG1wID0gYTsgYSA9IGI7IGIgPSB0bXA7IH1cbiAgICAgICAgICBpZiAoaWdub3JlQ2FzZSkgeyBhWzBdID0gYVswXS50b0xvd2VyQ2FzZSgpOyBiWzBdID0gYlswXS50b0xvd2VyQ2FzZSgpOyB9XG4gICAgICAgICAgcmV0dXJuIChhWzBdIDwgYlswXSkgPyAtMSA6IDE7XG4gICAgICAgIH1cbiAgICAgICAgbnVtUGFydC5zb3J0KHBhdHRlcm4gPyBjb21wYXJlUGF0dGVybkZuIDogY29tcGFyZUZuKTtcbiAgICAgICAgaWYgKHBhdHRlcm4pIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVBhcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG51bVBhcnRbaV0gPSBudW1QYXJ0W2ldLmlucHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghbnVtYmVyKSB7IHRleHRQYXJ0LnNvcnQoY29tcGFyZUZuKTsgfVxuICAgICAgICB0ZXh0ID0gKCFyZXZlcnNlKSA/IHRleHRQYXJ0LmNvbmNhdChudW1QYXJ0KSA6IG51bVBhcnQuY29uY2F0KHRleHRQYXJ0KTtcbiAgICAgICAgaWYgKHVuaXF1ZSkgeyAvLyBSZW1vdmUgZHVwbGljYXRlIGxpbmVzXG4gICAgICAgICAgdmFyIHRleHRPbGQgPSB0ZXh0O1xuICAgICAgICAgIHZhciBsYXN0TGluZTtcbiAgICAgICAgICB0ZXh0ID0gW107XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0T2xkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGV4dE9sZFtpXSAhPSBsYXN0TGluZSkge1xuICAgICAgICAgICAgICB0ZXh0LnB1c2godGV4dE9sZFtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0TGluZSA9IHRleHRPbGRbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNtLnJlcGxhY2VSYW5nZSh0ZXh0LmpvaW4oJ1xcbicpLCBjdXJTdGFydCwgY3VyRW5kKTtcbiAgICAgIH0sXG4gICAgICBnbG9iYWw6IGZ1bmN0aW9uKGNtLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gYSBnbG9iYWwgY29tbWFuZCBpcyBvZiB0aGUgZm9ybVxuICAgICAgICAvLyA6W3JhbmdlXWcvcGF0dGVybi9bY21kXVxuICAgICAgICAvLyBhcmdTdHJpbmcgaG9sZHMgdGhlIHN0cmluZyAvcGF0dGVybi9bY21kXVxuICAgICAgICB2YXIgYXJnU3RyaW5nID0gcGFyYW1zLmFyZ1N0cmluZztcbiAgICAgICAgaWYgKCFhcmdTdHJpbmcpIHtcbiAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ1JlZ3VsYXIgRXhwcmVzc2lvbiBtaXNzaW5nIGZyb20gZ2xvYmFsJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJhbmdlIGlzIHNwZWNpZmllZCBoZXJlXG4gICAgICAgIHZhciBsaW5lU3RhcnQgPSAocGFyYW1zLmxpbmUgIT09IHVuZGVmaW5lZCkgPyBwYXJhbXMubGluZSA6IGNtLmZpcnN0TGluZSgpO1xuICAgICAgICB2YXIgbGluZUVuZCA9IHBhcmFtcy5saW5lRW5kIHx8IHBhcmFtcy5saW5lIHx8IGNtLmxhc3RMaW5lKCk7XG4gICAgICAgIC8vIGdldCB0aGUgdG9rZW5zIGZyb20gYXJnU3RyaW5nXG4gICAgICAgIHZhciB0b2tlbnMgPSBzcGxpdEJ5U2xhc2goYXJnU3RyaW5nKTtcbiAgICAgICAgdmFyIHJlZ2V4UGFydCA9IGFyZ1N0cmluZywgY21kO1xuICAgICAgICBpZiAodG9rZW5zLmxlbmd0aCkge1xuICAgICAgICAgIHJlZ2V4UGFydCA9IHRva2Vuc1swXTtcbiAgICAgICAgICBjbWQgPSB0b2tlbnMuc2xpY2UoMSwgdG9rZW5zLmxlbmd0aCkuam9pbignLycpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWdleFBhcnQpIHtcbiAgICAgICAgICAvLyBJZiByZWdleCBwYXJ0IGlzIGVtcHR5LCB0aGVuIHVzZSB0aGUgcHJldmlvdXMgcXVlcnkuIE90aGVyd2lzZVxuICAgICAgICAgIC8vIHVzZSB0aGUgcmVnZXggcGFydCBhcyB0aGUgbmV3IHF1ZXJ5LlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgIHVwZGF0ZVNlYXJjaFF1ZXJ5KGNtLCByZWdleFBhcnQsIHRydWUgLyoqIGlnbm9yZUNhc2UgKi8sXG4gICAgICAgICAgICAgdHJ1ZSAvKiogc21hcnRDYXNlICovKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnSW52YWxpZCByZWdleDogJyArIHJlZ2V4UGFydCk7XG4gICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm93IHRoYXQgd2UgaGF2ZSB0aGUgcmVnZXhQYXJ0LCBzZWFyY2ggZm9yIHJlZ2V4IG1hdGNoZXMgaW4gdGhlXG4gICAgICAgIC8vIHNwZWNpZmllZCByYW5nZSBvZiBsaW5lc1xuICAgICAgICB2YXIgcXVlcnkgPSBnZXRTZWFyY2hTdGF0ZShjbSkuZ2V0UXVlcnkoKTtcbiAgICAgICAgdmFyIG1hdGNoZWRMaW5lcyA9IFtdLCBjb250ZW50ID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSBsaW5lU3RhcnQ7IGkgPD0gbGluZUVuZDsgaSsrKSB7XG4gICAgICAgICAgdmFyIG1hdGNoZWQgPSBxdWVyeS50ZXN0KGNtLmdldExpbmUoaSkpO1xuICAgICAgICAgIGlmIChtYXRjaGVkKSB7XG4gICAgICAgICAgICBtYXRjaGVkTGluZXMucHVzaChpKzEpO1xuICAgICAgICAgICAgY29udGVudCs9IGNtLmdldExpbmUoaSkgKyAnPGJyPic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIFtjbWRdLCBqdXN0IGRpc3BsYXkgdGhlIGxpc3Qgb2YgbWF0Y2hlZCBsaW5lc1xuICAgICAgICBpZiAoIWNtZCkge1xuICAgICAgICAgIHNob3dDb25maXJtKGNtLCBjb250ZW50KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgdmFyIG5leHRDb21tYW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGluZGV4IDwgbWF0Y2hlZExpbmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNvbW1hbmQgPSBtYXRjaGVkTGluZXNbaW5kZXhdICsgY21kO1xuICAgICAgICAgICAgZXhDb21tYW5kRGlzcGF0Y2hlci5wcm9jZXNzQ29tbWFuZChjbSwgY29tbWFuZCwge1xuICAgICAgICAgICAgICBjYWxsYmFjazogbmV4dENvbW1hbmRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9O1xuICAgICAgICBuZXh0Q29tbWFuZCgpO1xuICAgICAgfSxcbiAgICAgIHN1YnN0aXR1dGU6IGZ1bmN0aW9uKGNtLCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKCFjbS5nZXRTZWFyY2hDdXJzb3IpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlYXJjaCBmZWF0dXJlIG5vdCBhdmFpbGFibGUuIFJlcXVpcmVzIHNlYXJjaGN1cnNvci5qcyBvciAnICtcbiAgICAgICAgICAgICAgJ2FueSBvdGhlciBnZXRTZWFyY2hDdXJzb3IgaW1wbGVtZW50YXRpb24uJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFyZ1N0cmluZyA9IHBhcmFtcy5hcmdTdHJpbmc7XG4gICAgICAgIHZhciB0b2tlbnMgPSBhcmdTdHJpbmcgPyBzcGxpdEJ5U2VwYXJhdG9yKGFyZ1N0cmluZywgYXJnU3RyaW5nWzBdKSA6IFtdO1xuICAgICAgICB2YXIgcmVnZXhQYXJ0LCByZXBsYWNlUGFydCA9ICcnLCB0cmFpbGluZywgZmxhZ3NQYXJ0LCBjb3VudDtcbiAgICAgICAgdmFyIGNvbmZpcm0gPSBmYWxzZTsgLy8gV2hldGhlciB0byBjb25maXJtIGVhY2ggcmVwbGFjZS5cbiAgICAgICAgdmFyIGdsb2JhbCA9IGZhbHNlOyAvLyBUcnVlIHRvIHJlcGxhY2UgYWxsIGluc3RhbmNlcyBvbiBhIGxpbmUsIGZhbHNlIHRvIHJlcGxhY2Ugb25seSAxLlxuICAgICAgICBpZiAodG9rZW5zLmxlbmd0aCkge1xuICAgICAgICAgIHJlZ2V4UGFydCA9IHRva2Vuc1swXTtcbiAgICAgICAgICBpZiAoZ2V0T3B0aW9uKCdwY3JlJykgJiYgcmVnZXhQYXJ0ICE9PSAnJykge1xuICAgICAgICAgICAgICByZWdleFBhcnQgPSBuZXcgUmVnRXhwKHJlZ2V4UGFydCkuc291cmNlOyAvL25vcm1hbGl6ZSBub3QgZXNjYXBlZCBjaGFyYWN0ZXJzXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlcGxhY2VQYXJ0ID0gdG9rZW5zWzFdO1xuICAgICAgICAgIGlmIChyZWdleFBhcnQgJiYgcmVnZXhQYXJ0W3JlZ2V4UGFydC5sZW5ndGggLSAxXSA9PT0gJyQnKSB7XG4gICAgICAgICAgICByZWdleFBhcnQgPSByZWdleFBhcnQuc2xpY2UoMCwgcmVnZXhQYXJ0Lmxlbmd0aCAtIDEpICsgJ1xcXFxuJztcbiAgICAgICAgICAgIHJlcGxhY2VQYXJ0ID0gcmVwbGFjZVBhcnQgPyByZXBsYWNlUGFydCArICdcXG4nIDogJ1xcbic7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXBsYWNlUGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoZ2V0T3B0aW9uKCdwY3JlJykpIHtcbiAgICAgICAgICAgICAgcmVwbGFjZVBhcnQgPSB1bmVzY2FwZVJlZ2V4UmVwbGFjZShyZXBsYWNlUGFydC5yZXBsYWNlKC8oW15cXFxcXSkmL2csXCIkMSQkJlwiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXBsYWNlUGFydCA9IHRyYW5zbGF0ZVJlZ2V4UmVwbGFjZShyZXBsYWNlUGFydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5sYXN0U3Vic3RpdHV0ZVJlcGxhY2VQYXJ0ID0gcmVwbGFjZVBhcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRyYWlsaW5nID0gdG9rZW5zWzJdID8gdG9rZW5zWzJdLnNwbGl0KCcgJykgOiBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBlaXRoZXIgdGhlIGFyZ1N0cmluZyBpcyBlbXB0eSBvciBpdHMgb2YgdGhlIGZvcm0gJyBoZWxsby93b3JsZCdcbiAgICAgICAgICAvLyBhY3R1YWxseSBzcGxpdEJ5U2xhc2ggcmV0dXJucyBhIGxpc3Qgb2YgdG9rZW5zXG4gICAgICAgICAgLy8gb25seSBpZiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoIGEgJy8nXG4gICAgICAgICAgaWYgKGFyZ1N0cmluZyAmJiBhcmdTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ1N1YnN0aXR1dGlvbnMgc2hvdWxkIGJlIG9mIHRoZSBmb3JtICcgK1xuICAgICAgICAgICAgICAgICc6cy9wYXR0ZXJuL3JlcGxhY2UvJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEFmdGVyIHRoZSAzcmQgc2xhc2gsIHdlIGNhbiBoYXZlIGZsYWdzIGZvbGxvd2VkIGJ5IGEgc3BhY2UgZm9sbG93ZWRcbiAgICAgICAgLy8gYnkgY291bnQuXG4gICAgICAgIGlmICh0cmFpbGluZykge1xuICAgICAgICAgIGZsYWdzUGFydCA9IHRyYWlsaW5nWzBdO1xuICAgICAgICAgIGNvdW50ID0gcGFyc2VJbnQodHJhaWxpbmdbMV0pO1xuICAgICAgICAgIGlmIChmbGFnc1BhcnQpIHtcbiAgICAgICAgICAgIGlmIChmbGFnc1BhcnQuaW5kZXhPZignYycpICE9IC0xKSB7XG4gICAgICAgICAgICAgIGNvbmZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgICBmbGFnc1BhcnQucmVwbGFjZSgnYycsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmbGFnc1BhcnQuaW5kZXhPZignZycpICE9IC0xKSB7XG4gICAgICAgICAgICAgIGdsb2JhbCA9IHRydWU7XG4gICAgICAgICAgICAgIGZsYWdzUGFydC5yZXBsYWNlKCdnJywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdldE9wdGlvbigncGNyZScpKSB7XG4gICAgICAgICAgICAgICByZWdleFBhcnQgPSByZWdleFBhcnQgKyAnLycgKyBmbGFnc1BhcnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgcmVnZXhQYXJ0ID0gcmVnZXhQYXJ0LnJlcGxhY2UoL1xcLy9nLCBcIlxcXFwvXCIpICsgJy8nICsgZmxhZ3NQYXJ0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVnZXhQYXJ0KSB7XG4gICAgICAgICAgLy8gSWYgcmVnZXggcGFydCBpcyBlbXB0eSwgdGhlbiB1c2UgdGhlIHByZXZpb3VzIHF1ZXJ5LiBPdGhlcndpc2UgdXNlXG4gICAgICAgICAgLy8gdGhlIHJlZ2V4IHBhcnQgYXMgdGhlIG5ldyBxdWVyeS5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdXBkYXRlU2VhcmNoUXVlcnkoY20sIHJlZ2V4UGFydCwgdHJ1ZSAvKiogaWdub3JlQ2FzZSAqLyxcbiAgICAgICAgICAgICAgdHJ1ZSAvKiogc21hcnRDYXNlICovKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0ludmFsaWQgcmVnZXg6ICcgKyByZWdleFBhcnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXBsYWNlUGFydCA9IHJlcGxhY2VQYXJ0IHx8IHZpbUdsb2JhbFN0YXRlLmxhc3RTdWJzdGl0dXRlUmVwbGFjZVBhcnQ7XG4gICAgICAgIGlmIChyZXBsYWNlUGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdObyBwcmV2aW91cyBzdWJzdGl0dXRlIHJlZ3VsYXIgZXhwcmVzc2lvbicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RhdGUgPSBnZXRTZWFyY2hTdGF0ZShjbSk7XG4gICAgICAgIHZhciBxdWVyeSA9IHN0YXRlLmdldFF1ZXJ5KCk7XG4gICAgICAgIHZhciBsaW5lU3RhcnQgPSAocGFyYW1zLmxpbmUgIT09IHVuZGVmaW5lZCkgPyBwYXJhbXMubGluZSA6IGNtLmdldEN1cnNvcigpLmxpbmU7XG4gICAgICAgIHZhciBsaW5lRW5kID0gcGFyYW1zLmxpbmVFbmQgfHwgbGluZVN0YXJ0O1xuICAgICAgICBpZiAobGluZVN0YXJ0ID09IGNtLmZpcnN0TGluZSgpICYmIGxpbmVFbmQgPT0gY20ubGFzdExpbmUoKSkge1xuICAgICAgICAgIGxpbmVFbmQgPSBJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICBsaW5lU3RhcnQgPSBsaW5lRW5kO1xuICAgICAgICAgIGxpbmVFbmQgPSBsaW5lU3RhcnQgKyBjb3VudCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gY2xpcEN1cnNvclRvQ29udGVudChjbSwgUG9zKGxpbmVTdGFydCwgMCkpO1xuICAgICAgICB2YXIgY3Vyc29yID0gY20uZ2V0U2VhcmNoQ3Vyc29yKHF1ZXJ5LCBzdGFydFBvcyk7XG4gICAgICAgIGRvUmVwbGFjZShjbSwgY29uZmlybSwgZ2xvYmFsLCBsaW5lU3RhcnQsIGxpbmVFbmQsIGN1cnNvciwgcXVlcnksIHJlcGxhY2VQYXJ0LCBwYXJhbXMuY2FsbGJhY2spO1xuICAgICAgfSxcbiAgICAgIHJlZG86IENvZGVNaXJyb3IuY29tbWFuZHMucmVkbyxcbiAgICAgIHVuZG86IENvZGVNaXJyb3IuY29tbWFuZHMudW5kbyxcbiAgICAgIHdyaXRlOiBmdW5jdGlvbihjbSkge1xuICAgICAgICBpZiAoQ29kZU1pcnJvci5jb21tYW5kcy5zYXZlKSB7XG4gICAgICAgICAgLy8gSWYgYSBzYXZlIGNvbW1hbmQgaXMgZGVmaW5lZCwgY2FsbCBpdC5cbiAgICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzLnNhdmUoY20pO1xuICAgICAgICB9IGVsc2UgaWYgKGNtLnNhdmUpIHtcbiAgICAgICAgICAvLyBTYXZlcyB0byB0ZXh0IGFyZWEgaWYgbm8gc2F2ZSBjb21tYW5kIGlzIGRlZmluZWQgYW5kIGNtLnNhdmUoKSBpcyBhdmFpbGFibGUuXG4gICAgICAgICAgY20uc2F2ZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbm9obHNlYXJjaDogZnVuY3Rpb24oY20pIHtcbiAgICAgICAgY2xlYXJTZWFyY2hIaWdobGlnaHQoY20pO1xuICAgICAgfSxcbiAgICAgIHlhbms6IGZ1bmN0aW9uIChjbSkge1xuICAgICAgICB2YXIgY3VyID0gY29weUN1cnNvcihjbS5nZXRDdXJzb3IoKSk7XG4gICAgICAgIHZhciBsaW5lID0gY3VyLmxpbmU7XG4gICAgICAgIHZhciBsaW5lVGV4dCA9IGNtLmdldExpbmUobGluZSk7XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5wdXNoVGV4dChcbiAgICAgICAgICAnMCcsICd5YW5rJywgbGluZVRleHQsIHRydWUsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGRlbG1hcmtzOiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7XG4gICAgICAgIGlmICghcGFyYW1zLmFyZ1N0cmluZyB8fCAhdHJpbShwYXJhbXMuYXJnU3RyaW5nKSkge1xuICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnQXJndW1lbnQgcmVxdWlyZWQnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RhdGUgPSBjbS5zdGF0ZS52aW07XG4gICAgICAgIHZhciBzdHJlYW0gPSBuZXcgQ29kZU1pcnJvci5TdHJpbmdTdHJlYW0odHJpbShwYXJhbXMuYXJnU3RyaW5nKSk7XG4gICAgICAgIHdoaWxlICghc3RyZWFtLmVvbCgpKSB7XG4gICAgICAgICAgc3RyZWFtLmVhdFNwYWNlKCk7XG5cbiAgICAgICAgICAvLyBSZWNvcmQgdGhlIHN0cmVhbXMgcG9zaXRpb24gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgbG9vcCBmb3IgdXNlXG4gICAgICAgICAgLy8gaW4gZXJyb3IgbWVzc2FnZXMuXG4gICAgICAgICAgdmFyIGNvdW50ID0gc3RyZWFtLnBvcztcblxuICAgICAgICAgIGlmICghc3RyZWFtLm1hdGNoKC9bYS16QS1aXS8sIGZhbHNlKSkge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdJbnZhbGlkIGFyZ3VtZW50OiAnICsgcGFyYW1zLmFyZ1N0cmluZy5zdWJzdHJpbmcoY291bnQpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc3ltID0gc3RyZWFtLm5leHQoKTtcbiAgICAgICAgICAvLyBDaGVjayBpZiB0aGlzIHN5bWJvbCBpcyBwYXJ0IG9mIGEgcmFuZ2VcbiAgICAgICAgICBpZiAoc3RyZWFtLm1hdGNoKCctJywgdHJ1ZSkpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgc3ltYm9sIGlzIHBhcnQgb2YgYSByYW5nZS5cblxuICAgICAgICAgICAgLy8gVGhlIHJhbmdlIG11c3QgdGVybWluYXRlIGF0IGFuIGFscGhhYmV0aWMgY2hhcmFjdGVyLlxuICAgICAgICAgICAgaWYgKCFzdHJlYW0ubWF0Y2goL1thLXpBLVpdLywgZmFsc2UpKSB7XG4gICAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnSW52YWxpZCBhcmd1bWVudDogJyArIHBhcmFtcy5hcmdTdHJpbmcuc3Vic3RyaW5nKGNvdW50KSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN0YXJ0TWFyayA9IHN5bTtcbiAgICAgICAgICAgIHZhciBmaW5pc2hNYXJrID0gc3RyZWFtLm5leHQoKTtcbiAgICAgICAgICAgIC8vIFRoZSByYW5nZSBtdXN0IHRlcm1pbmF0ZSBhdCBhbiBhbHBoYWJldGljIGNoYXJhY3RlciB3aGljaFxuICAgICAgICAgICAgLy8gc2hhcmVzIHRoZSBzYW1lIGNhc2UgYXMgdGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAgICAgICAgICAgIGlmIChpc0xvd2VyQ2FzZShzdGFydE1hcmspICYmIGlzTG93ZXJDYXNlKGZpbmlzaE1hcmspIHx8XG4gICAgICAgICAgICAgICAgaXNVcHBlckNhc2Uoc3RhcnRNYXJrKSAmJiBpc1VwcGVyQ2FzZShmaW5pc2hNYXJrKSkge1xuICAgICAgICAgICAgICB2YXIgc3RhcnQgPSBzdGFydE1hcmsuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgICAgdmFyIGZpbmlzaCA9IGZpbmlzaE1hcmsuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgICAgaWYgKHN0YXJ0ID49IGZpbmlzaCkge1xuICAgICAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnSW52YWxpZCBhcmd1bWVudDogJyArIHBhcmFtcy5hcmdTdHJpbmcuc3Vic3RyaW5nKGNvdW50KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gQmVjYXVzZSBtYXJrcyBhcmUgYWx3YXlzIEFTQ0lJIHZhbHVlcywgYW5kIHdlIGhhdmVcbiAgICAgICAgICAgICAgLy8gZGV0ZXJtaW5lZCB0aGF0IHRoZXkgYXJlIHRoZSBzYW1lIGNhc2UsIHdlIGNhbiB1c2VcbiAgICAgICAgICAgICAgLy8gdGhlaXIgY2hhciBjb2RlcyB0byBpdGVyYXRlIHRocm91Z2ggdGhlIGRlZmluZWQgcmFuZ2UuXG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IGZpbmlzaCAtIHN0YXJ0OyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFyayA9IFN0cmluZy5mcm9tQ2hhckNvZGUoc3RhcnQgKyBqKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgc3RhdGUubWFya3NbbWFya107XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnSW52YWxpZCBhcmd1bWVudDogJyArIHN0YXJ0TWFyayArICctJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhpcyBzeW1ib2wgaXMgYSB2YWxpZCBtYXJrLCBhbmQgaXMgbm90IHBhcnQgb2YgYSByYW5nZS5cbiAgICAgICAgICAgIGRlbGV0ZSBzdGF0ZS5tYXJrc1tzeW1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZXhDb21tYW5kRGlzcGF0Y2hlciA9IG5ldyBFeENvbW1hbmREaXNwYXRjaGVyKCk7XG5cbiAgICAvKipcbiAgICAqIEBwYXJhbSB7Q29kZU1pcnJvcn0gY20gQ29kZU1pcnJvciBpbnN0YW5jZSB3ZSBhcmUgaW4uXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZpcm0gV2hldGhlciB0byBjb25maXJtIGVhY2ggcmVwbGFjZS5cbiAgICAqIEBwYXJhbSB7Q3Vyc29yfSBsaW5lU3RhcnQgTGluZSB0byBzdGFydCByZXBsYWNpbmcgZnJvbS5cbiAgICAqIEBwYXJhbSB7Q3Vyc29yfSBsaW5lRW5kIExpbmUgdG8gc3RvcCByZXBsYWNpbmcgYXQuXG4gICAgKiBAcGFyYW0ge1JlZ0V4cH0gcXVlcnkgUXVlcnkgZm9yIHBlcmZvcm1pbmcgbWF0Y2hlcyB3aXRoLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHJlcGxhY2VXaXRoIFRleHQgdG8gcmVwbGFjZSBtYXRjaGVzIHdpdGguIE1heSBjb250YWluICQxLFxuICAgICogICAgICQyLCBldGMgZm9yIHJlcGxhY2luZyBjYXB0dXJlZCBncm91cHMgdXNpbmcgSmF2YXNjcmlwdCByZXBsYWNlLlxuICAgICogQHBhcmFtIHtmdW5jdGlvbigpfSBjYWxsYmFjayBBIGNhbGxiYWNrIGZvciB3aGVuIHRoZSByZXBsYWNlIGlzIGRvbmUuXG4gICAgKi9cbiAgICBmdW5jdGlvbiBkb1JlcGxhY2UoY20sIGNvbmZpcm0sIGdsb2JhbCwgbGluZVN0YXJ0LCBsaW5lRW5kLCBzZWFyY2hDdXJzb3IsIHF1ZXJ5LFxuICAgICAgICByZXBsYWNlV2l0aCwgY2FsbGJhY2spIHtcbiAgICAgIC8vIFNldCB1cCBhbGwgdGhlIGZ1bmN0aW9ucy5cbiAgICAgIGNtLnN0YXRlLnZpbS5leE1vZGUgPSB0cnVlO1xuICAgICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICAgIHZhciBsYXN0UG9zID0gc2VhcmNoQ3Vyc29yLmZyb20oKTtcbiAgICAgIGZ1bmN0aW9uIHJlcGxhY2VBbGwoKSB7XG4gICAgICAgIGNtLm9wZXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aGlsZSAoIWRvbmUpIHtcbiAgICAgICAgICAgIHJlcGxhY2UoKTtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RvcCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHJlcGxhY2UoKSB7XG4gICAgICAgIHZhciB0ZXh0ID0gY20uZ2V0UmFuZ2Uoc2VhcmNoQ3Vyc29yLmZyb20oKSwgc2VhcmNoQ3Vyc29yLnRvKCkpO1xuICAgICAgICB2YXIgbmV3VGV4dCA9IHRleHQucmVwbGFjZShxdWVyeSwgcmVwbGFjZVdpdGgpO1xuICAgICAgICBzZWFyY2hDdXJzb3IucmVwbGFjZShuZXdUZXh0KTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgIC8vIFRoZSBiZWxvdyBvbmx5IGxvb3BzIHRvIHNraXAgb3ZlciBtdWx0aXBsZSBvY2N1cnJlbmNlcyBvbiB0aGUgc2FtZVxuICAgICAgICAvLyBsaW5lIHdoZW4gJ2dsb2JhbCcgaXMgbm90IHRydWUuXG4gICAgICAgIHdoaWxlKHNlYXJjaEN1cnNvci5maW5kTmV4dCgpICYmXG4gICAgICAgICAgICAgIGlzSW5SYW5nZShzZWFyY2hDdXJzb3IuZnJvbSgpLCBsaW5lU3RhcnQsIGxpbmVFbmQpKSB7XG4gICAgICAgICAgaWYgKCFnbG9iYWwgJiYgbGFzdFBvcyAmJiBzZWFyY2hDdXJzb3IuZnJvbSgpLmxpbmUgPT0gbGFzdFBvcy5saW5lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY20uc2Nyb2xsSW50b1ZpZXcoc2VhcmNoQ3Vyc29yLmZyb20oKSwgMzApO1xuICAgICAgICAgIGNtLnNldFNlbGVjdGlvbihzZWFyY2hDdXJzb3IuZnJvbSgpLCBzZWFyY2hDdXJzb3IudG8oKSk7XG4gICAgICAgICAgbGFzdFBvcyA9IHNlYXJjaEN1cnNvci5mcm9tKCk7XG4gICAgICAgICAgZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHN0b3AoY2xvc2UpIHtcbiAgICAgICAgaWYgKGNsb3NlKSB7IGNsb3NlKCk7IH1cbiAgICAgICAgY20uZm9jdXMoKTtcbiAgICAgICAgaWYgKGxhc3RQb3MpIHtcbiAgICAgICAgICBjbS5zZXRDdXJzb3IobGFzdFBvcyk7XG4gICAgICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgICAgICB2aW0uZXhNb2RlID0gZmFsc2U7XG4gICAgICAgICAgdmltLmxhc3RIUG9zID0gdmltLmxhc3RIU1BvcyA9IGxhc3RQb3MuY2g7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7IGNhbGxiYWNrKCk7IH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIG9uUHJvbXB0S2V5RG93bihlLCBfdmFsdWUsIGNsb3NlKSB7XG4gICAgICAgIC8vIFN3YWxsb3cgYWxsIGtleXMuXG4gICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICB2YXIga2V5TmFtZSA9IENvZGVNaXJyb3Iua2V5TmFtZShlKTtcbiAgICAgICAgc3dpdGNoIChrZXlOYW1lKSB7XG4gICAgICAgICAgY2FzZSAnWSc6XG4gICAgICAgICAgICByZXBsYWNlKCk7IG5leHQoKTsgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnTic6XG4gICAgICAgICAgICBuZXh0KCk7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ0EnOlxuICAgICAgICAgICAgLy8gcmVwbGFjZUFsbCBjb250YWlucyBhIGNhbGwgdG8gY2xvc2Ugb2YgaXRzIG93bi4gV2UgZG9uJ3Qgd2FudCBpdFxuICAgICAgICAgICAgLy8gdG8gZmlyZSB0b28gZWFybHkgb3IgbXVsdGlwbGUgdGltZXMuXG4gICAgICAgICAgICB2YXIgc2F2ZWRDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjbS5vcGVyYXRpb24ocmVwbGFjZUFsbCk7XG4gICAgICAgICAgICBjYWxsYmFjayA9IHNhdmVkQ2FsbGJhY2s7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdMJzpcbiAgICAgICAgICAgIHJlcGxhY2UoKTtcbiAgICAgICAgICAgIC8vIGZhbGwgdGhyb3VnaCBhbmQgZXhpdC5cbiAgICAgICAgICBjYXNlICdRJzpcbiAgICAgICAgICBjYXNlICdFc2MnOlxuICAgICAgICAgIGNhc2UgJ0N0cmwtQyc6XG4gICAgICAgICAgY2FzZSAnQ3RybC1bJzpcbiAgICAgICAgICAgIHN0b3AoY2xvc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRvbmUpIHsgc3RvcChjbG9zZSk7IH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEFjdHVhbGx5IGRvIHJlcGxhY2UuXG4gICAgICBuZXh0KCk7XG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICBzaG93Q29uZmlybShjbSwgJ05vIG1hdGNoZXMgZm9yICcgKyBxdWVyeS5zb3VyY2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWNvbmZpcm0pIHtcbiAgICAgICAgcmVwbGFjZUFsbCgpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHsgY2FsbGJhY2soKTsgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzaG93UHJvbXB0KGNtLCB7XG4gICAgICAgIHByZWZpeDogJ3JlcGxhY2Ugd2l0aCA8c3Ryb25nPicgKyByZXBsYWNlV2l0aCArICc8L3N0cm9uZz4gKHkvbi9hL3EvbCknLFxuICAgICAgICBvbktleURvd246IG9uUHJvbXB0S2V5RG93blxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgQ29kZU1pcnJvci5rZXlNYXAudmltID0ge1xuICAgICAgYXR0YWNoOiBhdHRhY2hWaW1NYXAsXG4gICAgICBkZXRhY2g6IGRldGFjaFZpbU1hcCxcbiAgICAgIGNhbGw6IGNtS2V5XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGV4aXRJbnNlcnRNb2RlKGNtKSB7XG4gICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICB2YXIgaW5zZXJ0TW9kZUNoYW5nZVJlZ2lzdGVyID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmdldFJlZ2lzdGVyKCcuJyk7XG4gICAgICB2YXIgaXNQbGF5aW5nID0gbWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nO1xuICAgICAgdmFyIGxhc3RDaGFuZ2UgPSBtYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXM7XG4gICAgICBpZiAoIWlzUGxheWluZykge1xuICAgICAgICBjbS5vZmYoJ2NoYW5nZScsIG9uQ2hhbmdlKTtcbiAgICAgICAgQ29kZU1pcnJvci5vZmYoY20uZ2V0SW5wdXRGaWVsZCgpLCAna2V5ZG93bicsIG9uS2V5RXZlbnRUYXJnZXRLZXlEb3duKTtcbiAgICAgIH1cbiAgICAgIGlmICghaXNQbGF5aW5nICYmIHZpbS5pbnNlcnRNb2RlUmVwZWF0ID4gMSkge1xuICAgICAgICAvLyBQZXJmb3JtIGluc2VydCBtb2RlIHJlcGVhdCBmb3IgY29tbWFuZHMgbGlrZSAzLGEgYW5kIDMsby5cbiAgICAgICAgcmVwZWF0TGFzdEVkaXQoY20sIHZpbSwgdmltLmluc2VydE1vZGVSZXBlYXQgLSAxLFxuICAgICAgICAgICAgdHJ1ZSAvKiogcmVwZWF0Rm9ySW5zZXJ0ICovKTtcbiAgICAgICAgdmltLmxhc3RFZGl0SW5wdXRTdGF0ZS5yZXBlYXRPdmVycmlkZSA9IHZpbS5pbnNlcnRNb2RlUmVwZWF0O1xuICAgICAgfVxuICAgICAgZGVsZXRlIHZpbS5pbnNlcnRNb2RlUmVwZWF0O1xuICAgICAgdmltLmluc2VydE1vZGUgPSBmYWxzZTtcbiAgICAgIGNtLnNldEN1cnNvcihjbS5nZXRDdXJzb3IoKS5saW5lLCBjbS5nZXRDdXJzb3IoKS5jaC0xKTtcbiAgICAgIGNtLnNldE9wdGlvbigna2V5TWFwJywgJ3ZpbScpO1xuICAgICAgY20uc2V0T3B0aW9uKCdkaXNhYmxlSW5wdXQnLCB0cnVlKTtcbiAgICAgIGNtLnRvZ2dsZU92ZXJ3cml0ZShmYWxzZSk7IC8vIGV4aXQgcmVwbGFjZSBtb2RlIGlmIHdlIHdlcmUgaW4gaXQuXG4gICAgICAvLyB1cGRhdGUgdGhlIFwiLiByZWdpc3RlciBiZWZvcmUgZXhpdGluZyBpbnNlcnQgbW9kZVxuICAgICAgaW5zZXJ0TW9kZUNoYW5nZVJlZ2lzdGVyLnNldFRleHQobGFzdENoYW5nZS5jaGFuZ2VzLmpvaW4oJycpKTtcbiAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCBcInZpbS1tb2RlLWNoYW5nZVwiLCB7bW9kZTogXCJub3JtYWxcIn0pO1xuICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmlzUmVjb3JkaW5nKSB7XG4gICAgICAgIGxvZ0luc2VydE1vZGVDaGFuZ2UobWFjcm9Nb2RlU3RhdGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9tYXBDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgIGRlZmF1bHRLZXltYXAudW5zaGlmdChjb21tYW5kKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXBDb21tYW5kKGtleXMsIHR5cGUsIG5hbWUsIGFyZ3MsIGV4dHJhKSB7XG4gICAgICB2YXIgY29tbWFuZCA9IHtrZXlzOiBrZXlzLCB0eXBlOiB0eXBlfTtcbiAgICAgIGNvbW1hbmRbdHlwZV0gPSBuYW1lO1xuICAgICAgY29tbWFuZFt0eXBlICsgXCJBcmdzXCJdID0gYXJncztcbiAgICAgIGZvciAodmFyIGtleSBpbiBleHRyYSlcbiAgICAgICAgY29tbWFuZFtrZXldID0gZXh0cmFba2V5XTtcbiAgICAgIF9tYXBDb21tYW5kKGNvbW1hbmQpO1xuICAgIH1cblxuICAgIC8vIFRoZSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHR3by1jaGFyYWN0ZXIgRVNDIGtleW1hcCBzaG91bGQgYmVcbiAgICAvLyBhZGp1c3RlZCBhY2NvcmRpbmcgdG8geW91ciB0eXBpbmcgc3BlZWQgdG8gcHJldmVudCBmYWxzZSBwb3NpdGl2ZXMuXG4gICAgZGVmaW5lT3B0aW9uKCdpbnNlcnRNb2RlRXNjS2V5c1RpbWVvdXQnLCAyMDAsICdudW1iZXInKTtcblxuICAgIENvZGVNaXJyb3Iua2V5TWFwWyd2aW0taW5zZXJ0J10gPSB7XG4gICAgICAvLyBUT0RPOiBvdmVycmlkZSBuYXZpZ2F0aW9uIGtleXMgc28gdGhhdCBFc2Mgd2lsbCBjYW5jZWwgYXV0b21hdGljXG4gICAgICAvLyBpbmRlbnRhdGlvbiBmcm9tIG8sIE8sIGlfPENSPlxuICAgICAgZmFsbHRocm91Z2g6IFsnZGVmYXVsdCddLFxuICAgICAgYXR0YWNoOiBhdHRhY2hWaW1NYXAsXG4gICAgICBkZXRhY2g6IGRldGFjaFZpbU1hcCxcbiAgICAgIGNhbGw6IGNtS2V5XG4gICAgfTtcblxuICAgIENvZGVNaXJyb3Iua2V5TWFwWyd2aW0tcmVwbGFjZSddID0ge1xuICAgICAgJ0JhY2tzcGFjZSc6ICdnb0NoYXJMZWZ0JyxcbiAgICAgIGZhbGx0aHJvdWdoOiBbJ3ZpbS1pbnNlcnQnXSxcbiAgICAgIGF0dGFjaDogYXR0YWNoVmltTWFwLFxuICAgICAgZGV0YWNoOiBkZXRhY2hWaW1NYXAsXG4gICAgICBjYWxsOiBjbUtleVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBleGVjdXRlTWFjcm9SZWdpc3RlcihjbSwgdmltLCBtYWNyb01vZGVTdGF0ZSwgcmVnaXN0ZXJOYW1lKSB7XG4gICAgICB2YXIgcmVnaXN0ZXIgPSB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIuZ2V0UmVnaXN0ZXIocmVnaXN0ZXJOYW1lKTtcbiAgICAgIGlmIChyZWdpc3Rlck5hbWUgPT0gJzonKSB7XG4gICAgICAgIC8vIFJlYWQtb25seSByZWdpc3RlciBjb250YWluaW5nIGxhc3QgRXggY29tbWFuZC5cbiAgICAgICAgaWYgKHJlZ2lzdGVyLmtleUJ1ZmZlclswXSkge1xuICAgICAgICAgIGV4Q29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc0NvbW1hbmQoY20sIHJlZ2lzdGVyLmtleUJ1ZmZlclswXSk7XG4gICAgICAgIH1cbiAgICAgICAgbWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBrZXlCdWZmZXIgPSByZWdpc3Rlci5rZXlCdWZmZXI7XG4gICAgICB2YXIgaW1jID0gMDtcbiAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IHRydWU7XG4gICAgICBtYWNyb01vZGVTdGF0ZS5yZXBsYXlTZWFyY2hRdWVyaWVzID0gcmVnaXN0ZXIuc2VhcmNoUXVlcmllcy5zbGljZSgwKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5QnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0ZXh0ID0ga2V5QnVmZmVyW2ldO1xuICAgICAgICB2YXIgbWF0Y2gsIGtleTtcbiAgICAgICAgd2hpbGUgKHRleHQpIHtcbiAgICAgICAgICAvLyBQdWxsIG9mZiBvbmUgY29tbWFuZCBrZXksIHdoaWNoIGlzIGVpdGhlciBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAgICAgICAvLyBvciBhIHNwZWNpYWwgc2VxdWVuY2Ugd3JhcHBlZCBpbiAnPCcgYW5kICc+JywgZS5nLiAnPFNwYWNlPicuXG4gICAgICAgICAgbWF0Y2ggPSAoLzxcXHcrLS4rPz58PFxcdys+fC4vKS5leGVjKHRleHQpO1xuICAgICAgICAgIGtleSA9IG1hdGNoWzBdO1xuICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZyhtYXRjaC5pbmRleCArIGtleS5sZW5ndGgpO1xuICAgICAgICAgIENvZGVNaXJyb3IuVmltLmhhbmRsZUtleShjbSwga2V5LCAnbWFjcm8nKTtcbiAgICAgICAgICBpZiAodmltLmluc2VydE1vZGUpIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VzID0gcmVnaXN0ZXIuaW5zZXJ0TW9kZUNoYW5nZXNbaW1jKytdLmNoYW5nZXM7XG4gICAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXMuY2hhbmdlcyA9XG4gICAgICAgICAgICAgICAgY2hhbmdlcztcbiAgICAgICAgICAgIHJlcGVhdEluc2VydE1vZGVDaGFuZ2VzKGNtLCBjaGFuZ2VzLCAxKTtcbiAgICAgICAgICAgIGV4aXRJbnNlcnRNb2RlKGNtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZ0tleShtYWNyb01vZGVTdGF0ZSwga2V5KSB7XG4gICAgICBpZiAobWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nKSB7IHJldHVybjsgfVxuICAgICAgdmFyIHJlZ2lzdGVyTmFtZSA9IG1hY3JvTW9kZVN0YXRlLmxhdGVzdFJlZ2lzdGVyO1xuICAgICAgdmFyIHJlZ2lzdGVyID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmdldFJlZ2lzdGVyKHJlZ2lzdGVyTmFtZSk7XG4gICAgICBpZiAocmVnaXN0ZXIpIHtcbiAgICAgICAgcmVnaXN0ZXIucHVzaFRleHQoa2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2dJbnNlcnRNb2RlQ2hhbmdlKG1hY3JvTW9kZVN0YXRlKSB7XG4gICAgICBpZiAobWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nKSB7IHJldHVybjsgfVxuICAgICAgdmFyIHJlZ2lzdGVyTmFtZSA9IG1hY3JvTW9kZVN0YXRlLmxhdGVzdFJlZ2lzdGVyO1xuICAgICAgdmFyIHJlZ2lzdGVyID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmdldFJlZ2lzdGVyKHJlZ2lzdGVyTmFtZSk7XG4gICAgICBpZiAocmVnaXN0ZXIgJiYgcmVnaXN0ZXIucHVzaEluc2VydE1vZGVDaGFuZ2VzKSB7XG4gICAgICAgIHJlZ2lzdGVyLnB1c2hJbnNlcnRNb2RlQ2hhbmdlcyhtYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZ1NlYXJjaFF1ZXJ5KG1hY3JvTW9kZVN0YXRlLCBxdWVyeSkge1xuICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZykgeyByZXR1cm47IH1cbiAgICAgIHZhciByZWdpc3Rlck5hbWUgPSBtYWNyb01vZGVTdGF0ZS5sYXRlc3RSZWdpc3RlcjtcbiAgICAgIHZhciByZWdpc3RlciA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5nZXRSZWdpc3RlcihyZWdpc3Rlck5hbWUpO1xuICAgICAgaWYgKHJlZ2lzdGVyICYmIHJlZ2lzdGVyLnB1c2hTZWFyY2hRdWVyeSkge1xuICAgICAgICByZWdpc3Rlci5wdXNoU2VhcmNoUXVlcnkocXVlcnkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpc3RlbnMgZm9yIGNoYW5nZXMgbWFkZSBpbiBpbnNlcnQgbW9kZS5cbiAgICAgKiBTaG91bGQgb25seSBiZSBhY3RpdmUgaW4gaW5zZXJ0IG1vZGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gb25DaGFuZ2UoY20sIGNoYW5nZU9iaikge1xuICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICB2YXIgbGFzdENoYW5nZSA9IG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcztcbiAgICAgIGlmICghbWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nKSB7XG4gICAgICAgIHdoaWxlKGNoYW5nZU9iaikge1xuICAgICAgICAgIGxhc3RDaGFuZ2UuZXhwZWN0Q3Vyc29yQWN0aXZpdHlGb3JDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgIGlmIChsYXN0Q2hhbmdlLmlnbm9yZUNvdW50ID4gMSkge1xuICAgICAgICAgICAgbGFzdENoYW5nZS5pZ25vcmVDb3VudC0tO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2hhbmdlT2JqLm9yaWdpbiA9PSAnK2lucHV0JyB8fCBjaGFuZ2VPYmoub3JpZ2luID09ICdwYXN0ZSdcbiAgICAgICAgICAgICAgfHwgY2hhbmdlT2JqLm9yaWdpbiA9PT0gdW5kZWZpbmVkIC8qIG9ubHkgaW4gdGVzdGluZyAqLykge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbkNvdW50ID0gY20ubGlzdFNlbGVjdGlvbnMoKS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uQ291bnQgPiAxKVxuICAgICAgICAgICAgICBsYXN0Q2hhbmdlLmlnbm9yZUNvdW50ID0gc2VsZWN0aW9uQ291bnQ7XG4gICAgICAgICAgICB2YXIgdGV4dCA9IGNoYW5nZU9iai50ZXh0LmpvaW4oJ1xcbicpO1xuICAgICAgICAgICAgaWYgKGxhc3RDaGFuZ2UubWF5YmVSZXNldCkge1xuICAgICAgICAgICAgICBsYXN0Q2hhbmdlLmNoYW5nZXMgPSBbXTtcbiAgICAgICAgICAgICAgbGFzdENoYW5nZS5tYXliZVJlc2V0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgICBpZiAoY20uc3RhdGUub3ZlcndyaXRlICYmICEvXFxuLy50ZXN0KHRleHQpKSB7XG4gICAgICAgICAgICAgICAgbGFzdENoYW5nZS5jaGFuZ2VzLnB1c2goW3RleHRdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsYXN0Q2hhbmdlLmNoYW5nZXMucHVzaCh0ZXh0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDaGFuZ2Ugb2JqZWN0cyBtYXkgYmUgY2hhaW5lZCB3aXRoIG5leHQuXG4gICAgICAgICAgY2hhbmdlT2JqID0gY2hhbmdlT2JqLm5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIExpc3RlbnMgZm9yIGFueSBraW5kIG9mIGN1cnNvciBhY3Rpdml0eSBvbiBDb2RlTWlycm9yLlxuICAgICovXG4gICAgZnVuY3Rpb24gb25DdXJzb3JBY3Rpdml0eShjbSkge1xuICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgIGlmICh2aW0uaW5zZXJ0TW9kZSkge1xuICAgICAgICAvLyBUcmFja2luZyBjdXJzb3IgYWN0aXZpdHkgaW4gaW5zZXJ0IG1vZGUgKGZvciBtYWNybyBzdXBwb3J0KS5cbiAgICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICAgIGlmIChtYWNyb01vZGVTdGF0ZS5pc1BsYXlpbmcpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBsYXN0Q2hhbmdlID0gbWFjcm9Nb2RlU3RhdGUubGFzdEluc2VydE1vZGVDaGFuZ2VzO1xuICAgICAgICBpZiAobGFzdENoYW5nZS5leHBlY3RDdXJzb3JBY3Rpdml0eUZvckNoYW5nZSkge1xuICAgICAgICAgIGxhc3RDaGFuZ2UuZXhwZWN0Q3Vyc29yQWN0aXZpdHlGb3JDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDdXJzb3IgbW92ZWQgb3V0c2lkZSB0aGUgY29udGV4dCBvZiBhbiBlZGl0LiBSZXNldCB0aGUgY2hhbmdlLlxuICAgICAgICAgIGxhc3RDaGFuZ2UubWF5YmVSZXNldCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIWNtLmN1ck9wLmlzVmltT3ApIHtcbiAgICAgICAgaGFuZGxlRXh0ZXJuYWxTZWxlY3Rpb24oY20sIHZpbSk7XG4gICAgICB9XG4gICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgdXBkYXRlRmFrZUN1cnNvcihjbSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZUZha2VDdXJzb3IoY20pIHtcbiAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICB2YXIgZnJvbSA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIGNvcHlDdXJzb3IodmltLnNlbC5oZWFkKSk7XG4gICAgICB2YXIgdG8gPSBvZmZzZXRDdXJzb3IoZnJvbSwgMCwgMSk7XG4gICAgICBpZiAodmltLmZha2VDdXJzb3IpIHtcbiAgICAgICAgdmltLmZha2VDdXJzb3IuY2xlYXIoKTtcbiAgICAgIH1cbiAgICAgIHZpbS5mYWtlQ3Vyc29yID0gY20ubWFya1RleHQoZnJvbSwgdG8sIHtjbGFzc05hbWU6ICdjbS1hbmltYXRlLWZhdC1jdXJzb3InfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhbmRsZUV4dGVybmFsU2VsZWN0aW9uKGNtLCB2aW0pIHtcbiAgICAgIHZhciBhbmNob3IgPSBjbS5nZXRDdXJzb3IoJ2FuY2hvcicpO1xuICAgICAgdmFyIGhlYWQgPSBjbS5nZXRDdXJzb3IoJ2hlYWQnKTtcbiAgICAgIC8vIEVudGVyIG9yIGV4aXQgdmlzdWFsIG1vZGUgdG8gbWF0Y2ggbW91c2Ugc2VsZWN0aW9uLlxuICAgICAgaWYgKHZpbS52aXN1YWxNb2RlICYmICFjbS5zb21ldGhpbmdTZWxlY3RlZCgpKSB7XG4gICAgICAgIGV4aXRWaXN1YWxNb2RlKGNtLCBmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKCF2aW0udmlzdWFsTW9kZSAmJiAhdmltLmluc2VydE1vZGUgJiYgY20uc29tZXRoaW5nU2VsZWN0ZWQoKSkge1xuICAgICAgICB2aW0udmlzdWFsTW9kZSA9IHRydWU7XG4gICAgICAgIHZpbS52aXN1YWxMaW5lID0gZmFsc2U7XG4gICAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCBcInZpbS1tb2RlLWNoYW5nZVwiLCB7bW9kZTogXCJ2aXN1YWxcIn0pO1xuICAgICAgfVxuICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgIC8vIEJpbmQgQ29kZU1pcnJvciBzZWxlY3Rpb24gbW9kZWwgdG8gdmltIHNlbGVjdGlvbiBtb2RlbC5cbiAgICAgICAgLy8gTW91c2Ugc2VsZWN0aW9ucyBhcmUgY29uc2lkZXJlZCB2aXN1YWwgY2hhcmFjdGVyd2lzZS5cbiAgICAgICAgdmFyIGhlYWRPZmZzZXQgPSAhY3Vyc29ySXNCZWZvcmUoaGVhZCwgYW5jaG9yKSA/IC0xIDogMDtcbiAgICAgICAgdmFyIGFuY2hvck9mZnNldCA9IGN1cnNvcklzQmVmb3JlKGhlYWQsIGFuY2hvcikgPyAtMSA6IDA7XG4gICAgICAgIGhlYWQgPSBvZmZzZXRDdXJzb3IoaGVhZCwgMCwgaGVhZE9mZnNldCk7XG4gICAgICAgIGFuY2hvciA9IG9mZnNldEN1cnNvcihhbmNob3IsIDAsIGFuY2hvck9mZnNldCk7XG4gICAgICAgIHZpbS5zZWwgPSB7XG4gICAgICAgICAgYW5jaG9yOiBhbmNob3IsXG4gICAgICAgICAgaGVhZDogaGVhZFxuICAgICAgICB9O1xuICAgICAgICB1cGRhdGVNYXJrKGNtLCB2aW0sICc8JywgY3Vyc29yTWluKGhlYWQsIGFuY2hvcikpO1xuICAgICAgICB1cGRhdGVNYXJrKGNtLCB2aW0sICc+JywgY3Vyc29yTWF4KGhlYWQsIGFuY2hvcikpO1xuICAgICAgfSBlbHNlIGlmICghdmltLmluc2VydE1vZGUpIHtcbiAgICAgICAgLy8gUmVzZXQgbGFzdEhQb3MgaWYgc2VsZWN0aW9uIHdhcyBtb2RpZmllZCBieSBzb21ldGhpbmcgb3V0c2lkZSBvZiB2aW0gbW9kZSBlLmcuIGJ5IG1vdXNlLlxuICAgICAgICB2aW0ubGFzdEhQb3MgPSBjbS5nZXRDdXJzb3IoKS5jaDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogV3JhcHBlciBmb3Igc3BlY2lhbCBrZXlzIHByZXNzZWQgaW4gaW5zZXJ0IG1vZGUgKi9cbiAgICBmdW5jdGlvbiBJbnNlcnRNb2RlS2V5KGtleU5hbWUpIHtcbiAgICAgIHRoaXMua2V5TmFtZSA9IGtleU5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBIYW5kbGVzIHJhdyBrZXkgZG93biBldmVudHMgZnJvbSB0aGUgdGV4dCBhcmVhLlxuICAgICogLSBTaG91bGQgb25seSBiZSBhY3RpdmUgaW4gaW5zZXJ0IG1vZGUuXG4gICAgKiAtIEZvciByZWNvcmRpbmcgZGVsZXRlcyBpbiBpbnNlcnQgbW9kZS5cbiAgICAqL1xuICAgIGZ1bmN0aW9uIG9uS2V5RXZlbnRUYXJnZXRLZXlEb3duKGUpIHtcbiAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgdmFyIGxhc3RDaGFuZ2UgPSBtYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXM7XG4gICAgICB2YXIga2V5TmFtZSA9IENvZGVNaXJyb3Iua2V5TmFtZShlKTtcbiAgICAgIGlmICgha2V5TmFtZSkgeyByZXR1cm47IH1cbiAgICAgIGZ1bmN0aW9uIG9uS2V5Rm91bmQoKSB7XG4gICAgICAgIGlmIChsYXN0Q2hhbmdlLm1heWJlUmVzZXQpIHtcbiAgICAgICAgICBsYXN0Q2hhbmdlLmNoYW5nZXMgPSBbXTtcbiAgICAgICAgICBsYXN0Q2hhbmdlLm1heWJlUmVzZXQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0Q2hhbmdlLmNoYW5nZXMucHVzaChuZXcgSW5zZXJ0TW9kZUtleShrZXlOYW1lKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGtleU5hbWUuaW5kZXhPZignRGVsZXRlJykgIT0gLTEgfHwga2V5TmFtZS5pbmRleE9mKCdCYWNrc3BhY2UnKSAhPSAtMSkge1xuICAgICAgICBDb2RlTWlycm9yLmxvb2t1cEtleShrZXlOYW1lLCAndmltLWluc2VydCcsIG9uS2V5Rm91bmQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcGVhdHMgdGhlIGxhc3QgZWRpdCwgd2hpY2ggaW5jbHVkZXMgZXhhY3RseSAxIGNvbW1hbmQgYW5kIGF0IG1vc3QgMVxuICAgICAqIGluc2VydC4gT3BlcmF0b3IgYW5kIG1vdGlvbiBjb21tYW5kcyBhcmUgcmVhZCBmcm9tIGxhc3RFZGl0SW5wdXRTdGF0ZSxcbiAgICAgKiB3aGlsZSBhY3Rpb24gY29tbWFuZHMgYXJlIHJlYWQgZnJvbSBsYXN0RWRpdEFjdGlvbkNvbW1hbmQuXG4gICAgICpcbiAgICAgKiBJZiByZXBlYXRGb3JJbnNlcnQgaXMgdHJ1ZSwgdGhlbiB0aGUgZnVuY3Rpb24gd2FzIGNhbGxlZCBieVxuICAgICAqIGV4aXRJbnNlcnRNb2RlIHRvIHJlcGVhdCB0aGUgaW5zZXJ0IG1vZGUgY2hhbmdlcyB0aGUgdXNlciBqdXN0IG1hZGUuIFRoZVxuICAgICAqIGNvcnJlc3BvbmRpbmcgZW50ZXJJbnNlcnRNb2RlIGNhbGwgd2FzIG1hZGUgd2l0aCBhIGNvdW50LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlcGVhdExhc3RFZGl0KGNtLCB2aW0sIHJlcGVhdCwgcmVwZWF0Rm9ySW5zZXJ0KSB7XG4gICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IHRydWU7XG4gICAgICB2YXIgaXNBY3Rpb24gPSAhIXZpbS5sYXN0RWRpdEFjdGlvbkNvbW1hbmQ7XG4gICAgICB2YXIgY2FjaGVkSW5wdXRTdGF0ZSA9IHZpbS5pbnB1dFN0YXRlO1xuICAgICAgZnVuY3Rpb24gcmVwZWF0Q29tbWFuZCgpIHtcbiAgICAgICAgaWYgKGlzQWN0aW9uKSB7XG4gICAgICAgICAgY29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc0FjdGlvbihjbSwgdmltLCB2aW0ubGFzdEVkaXRBY3Rpb25Db21tYW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tYW5kRGlzcGF0Y2hlci5ldmFsSW5wdXQoY20sIHZpbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHJlcGVhdEluc2VydChyZXBlYXQpIHtcbiAgICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcy5jaGFuZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBGb3Igc29tZSByZWFzb24sIHJlcGVhdCBjdyBpbiBkZXNrdG9wIFZJTSBkb2VzIG5vdCByZXBlYXRcbiAgICAgICAgICAvLyBpbnNlcnQgbW9kZSBjaGFuZ2VzLiBXaWxsIGNvbmZvcm0gdG8gdGhhdCBiZWhhdmlvci5cbiAgICAgICAgICByZXBlYXQgPSAhdmltLmxhc3RFZGl0QWN0aW9uQ29tbWFuZCA/IDEgOiByZXBlYXQ7XG4gICAgICAgICAgdmFyIGNoYW5nZU9iamVjdCA9IG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcztcbiAgICAgICAgICByZXBlYXRJbnNlcnRNb2RlQ2hhbmdlcyhjbSwgY2hhbmdlT2JqZWN0LmNoYW5nZXMsIHJlcGVhdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZpbS5pbnB1dFN0YXRlID0gdmltLmxhc3RFZGl0SW5wdXRTdGF0ZTtcbiAgICAgIGlmIChpc0FjdGlvbiAmJiB2aW0ubGFzdEVkaXRBY3Rpb25Db21tYW5kLmludGVybGFjZUluc2VydFJlcGVhdCkge1xuICAgICAgICAvLyBvIGFuZCBPIHJlcGVhdCBoYXZlIHRvIGJlIGludGVybGFjZWQgd2l0aCBpbnNlcnQgcmVwZWF0cyBzbyB0aGF0IHRoZVxuICAgICAgICAvLyBpbnNlcnRpb25zIGFwcGVhciBvbiBzZXBhcmF0ZSBsaW5lcyBpbnN0ZWFkIG9mIHRoZSBsYXN0IGxpbmUuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgICByZXBlYXRDb21tYW5kKCk7XG4gICAgICAgICAgcmVwZWF0SW5zZXJ0KDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXJlcGVhdEZvckluc2VydCkge1xuICAgICAgICAgIC8vIEhhY2sgdG8gZ2V0IHRoZSBjdXJzb3IgdG8gZW5kIHVwIGF0IHRoZSByaWdodCBwbGFjZS4gSWYgSSBpc1xuICAgICAgICAgIC8vIHJlcGVhdGVkIGluIGluc2VydCBtb2RlIHJlcGVhdCwgY3Vyc29yIHdpbGwgYmUgMSBpbnNlcnRcbiAgICAgICAgICAvLyBjaGFuZ2Ugc2V0IGxlZnQgb2Ygd2hlcmUgaXQgc2hvdWxkIGJlLlxuICAgICAgICAgIHJlcGVhdENvbW1hbmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXBlYXRJbnNlcnQocmVwZWF0KTtcbiAgICAgIH1cbiAgICAgIHZpbS5pbnB1dFN0YXRlID0gY2FjaGVkSW5wdXRTdGF0ZTtcbiAgICAgIGlmICh2aW0uaW5zZXJ0TW9kZSAmJiAhcmVwZWF0Rm9ySW5zZXJ0KSB7XG4gICAgICAgIC8vIERvbid0IGV4aXQgaW5zZXJ0IG1vZGUgdHdpY2UuIElmIHJlcGVhdEZvckluc2VydCBpcyBzZXQsIHRoZW4gd2VcbiAgICAgICAgLy8gd2VyZSBjYWxsZWQgYnkgYW4gZXhpdEluc2VydE1vZGUgY2FsbCBsb3dlciBvbiB0aGUgc3RhY2suXG4gICAgICAgIGV4aXRJbnNlcnRNb2RlKGNtKTtcbiAgICAgIH1cbiAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcGVhdEluc2VydE1vZGVDaGFuZ2VzKGNtLCBjaGFuZ2VzLCByZXBlYXQpIHtcbiAgICAgIGZ1bmN0aW9uIGtleUhhbmRsZXIoYmluZGluZykge1xuICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmcgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW2JpbmRpbmddKGNtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiaW5kaW5nKGNtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBoZWFkID0gY20uZ2V0Q3Vyc29yKCdoZWFkJyk7XG4gICAgICB2YXIgdmlzdWFsQmxvY2sgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXMudmlzdWFsQmxvY2s7XG4gICAgICBpZiAodmlzdWFsQmxvY2spIHtcbiAgICAgICAgLy8gU2V0IHVwIGJsb2NrIHNlbGVjdGlvbiBhZ2FpbiBmb3IgcmVwZWF0aW5nIHRoZSBjaGFuZ2VzLlxuICAgICAgICBzZWxlY3RGb3JJbnNlcnQoY20sIGhlYWQsIHZpc3VhbEJsb2NrICsgMSk7XG4gICAgICAgIHJlcGVhdCA9IGNtLmxpc3RTZWxlY3Rpb25zKCkubGVuZ3RoO1xuICAgICAgICBjbS5zZXRDdXJzb3IoaGVhZCk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcGVhdDsgaSsrKSB7XG4gICAgICAgIGlmICh2aXN1YWxCbG9jaykge1xuICAgICAgICAgIGNtLnNldEN1cnNvcihvZmZzZXRDdXJzb3IoaGVhZCwgaSwgMCkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2hhbmdlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHZhciBjaGFuZ2UgPSBjaGFuZ2VzW2pdO1xuICAgICAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRNb2RlS2V5KSB7XG4gICAgICAgICAgICBDb2RlTWlycm9yLmxvb2t1cEtleShjaGFuZ2Uua2V5TmFtZSwgJ3ZpbS1pbnNlcnQnLCBrZXlIYW5kbGVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjaGFuZ2UgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdmFyIGN1ciA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKGNoYW5nZSwgY3VyLCBjdXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgICAgIHZhciBlbmQgPSBvZmZzZXRDdXJzb3Ioc3RhcnQsIDAsIGNoYW5nZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKGNoYW5nZVswXSwgc3RhcnQsIGVuZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmlzdWFsQmxvY2spIHtcbiAgICAgICAgY20uc2V0Q3Vyc29yKG9mZnNldEN1cnNvcihoZWFkLCAwLCAxKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXRWaW1HbG9iYWxTdGF0ZSgpO1xuICAgIHJldHVybiB2aW1BcGk7XG4gIH07XG4gIC8vIEluaXRpYWxpemUgVmltIGFuZCBtYWtlIGl0IGF2YWlsYWJsZSBhcyBhbiBBUEkuXG4gIENvZGVNaXJyb3IuVmltID0gVmltKCk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=