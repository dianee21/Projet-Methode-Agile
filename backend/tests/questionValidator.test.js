const test = require('node:test');
const assert = require('node:assert/strict');
const { validateQuestion } = require('../validators/questionValidator');
const qcm = () => ({ enonce: 'Quelle est la bonne réponse ?', type: 'qcm', reponses: [
  { texte: 'A', est_correcte: true }, { texte: 'B', est_correcte: false }
] });

test('QCM valide', () => assert.equal(validateQuestion(qcm()).valid, true));
test('refuse un objet absent', () => assert.equal(validateQuestion(null).valid, false));
test('refuse un énoncé vide', () => assert.equal(validateQuestion({ ...qcm(), enonce: ' ' }).valid, false));
test('refuse plus de cinq réponses', () => assert.equal(validateQuestion({ ...qcm(), reponses: Array(6).fill({ texte: 'A', est_correcte: false }) }).valid, false));
test('refuse deux bonnes réponses', () => assert.equal(validateQuestion({ ...qcm(), reponses: [{ texte: 'A', est_correcte: true }, { texte: 'B', est_correcte: true }] }).valid, false));
test('refuse zéro bonne réponse', () => assert.equal(validateQuestion({ ...qcm(), reponses: [{ texte: 'A', est_correcte: false }, { texte: 'B', est_correcte: false }] }).valid, false));
test('refuse un indicateur non booléen', () => assert.equal(validateQuestion({ ...qcm(), reponses: [{ texte: 'A', est_correcte: 1 }, { texte: 'B', est_correcte: false }] }).valid, false));
test('accepte Vrai/Faux', () => assert.equal(validateQuestion({ enonce: 'La Terre est ronde ?', type: 'vrai_faux', reponses: [{ texte: 'Vrai', est_correcte: true }, { texte: 'Faux', est_correcte: false }] }).valid, true));
test('refuse Vrai/Faux avec mauvais intitulés', () => assert.equal(validateQuestion({ enonce: 'Question ?', type: 'vrai_faux', reponses: [{ texte: 'Oui', est_correcte: true }, { texte: 'Non', est_correcte: false }] }).valid, false));
