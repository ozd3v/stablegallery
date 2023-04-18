// TextDisplay.tsx
import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DialogStyles from '../../styles/DialogStyles.module.css';
import IconButton from '@mui/material/IconButton';
import CopyIcon from '@mui/icons-material/FileCopy';
import Button from '@mui/material/Button';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

type Props = {
    rawText: string;
}
const TextDisplay: React.FC<Props> = ({ rawText }) => {
    //console.log('rawText', rawText);
    const textWithoutCarriageReturns = rawText.replace(/\r/g, '');
    const normalizedText = textWithoutCarriageReturns.replace(/\n{2,}/g, '\n');
    //console.log('normalizedText', normalizedText);

    const promptRegExp = /(.*?)(Negative prompt:.*?)?(Steps:.*)/s;
    const matchResult = normalizedText.match(promptRegExp);

    if (!matchResult) {
        console.error('Error: Text format not recognized')
        return null;
    }

    const [, promptText, negativePromptText, detailsText] = matchResult;
    const negativePromptWithoutLabel = negativePromptText
        ? negativePromptText.replace('Negative prompt:', '').trim()
        : '';
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => {
                console.log('Copied to clipboard:', text);
            },
            (err) => {
                console.error('Error copying to clipboard:', err);
            }
        );
    };
    const createWhatsAppLink = (prompt: string, negativePrompt: string, details: string) => {
        const message = `Prompt:\n${prompt}\n\nNegative Prompt:\n${negativePrompt}\n\nDetalles:\n${details}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        return whatsappUrl;
    };
    return (
        <Box  >
            <Button
                variant="contained"
                color="primary"
                className={DialogStyles.whatsAppButton}
                startIcon={<WhatsAppIcon />}
                href={createWhatsAppLink(promptText, negativePromptWithoutLabel, detailsText)}
                target="_blank"
                rel="noopener noreferrer"
            >
                Enviar a WhatsApp
            </Button>
            <h2 className={DialogStyles.dialogTitle}>
                Prompt
                <IconButton
                    onClick={() => copyToClipboard(promptText)}
                    size="small"
                    edge="end"
                    className={DialogStyles.copyButton}
                >
                    <CopyIcon />
                </IconButton>
            </h2>
            <TextField
                multiline
                fullWidth
                value={promptText}
                InputProps={{
                    readOnly: true,
                    classes: { input: DialogStyles.dialogText }
                }}
                variant="outlined"
            />

            <h2 className={DialogStyles.dialogTitle}>
                Negative Prompt
                <IconButton
                    onClick={() => copyToClipboard(negativePromptWithoutLabel)}
                    size="small"
                    edge="end"
                    className={DialogStyles.copyButton}
                >
                    <CopyIcon />
                </IconButton>
            </h2>
            <TextField
                multiline
                fullWidth
                value={negativePromptWithoutLabel}
                InputProps={{
                    readOnly: true,
                    classes: { input: DialogStyles.dialogText }
                }}
                variant="outlined"
            />

            <h2 className={DialogStyles.dialogTitle}>Detalles</h2>
            <TextField
                multiline
                fullWidth
                value={detailsText}
                InputProps={{
                    readOnly: true,
                    classes: { input: DialogStyles.dialogText }
                }}
                variant="outlined"

            />
        </Box>
    );
};

export default TextDisplay;
