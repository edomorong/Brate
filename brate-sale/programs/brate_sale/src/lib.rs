use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use anchor_lang::solana_program::pubkey::Pubkey;

// ID FIJO – NO CAMBIAR MÁS
declare_id!("9FYgGhMtDihHt9192GuZr9PREB24zV5c5Pkpgb8FVRV5");

#[program]
pub mod brate_sale {
    use super::*;

    /// Inicializa el estado del contrato
    pub fn initialize(ctx: Context<Initialize>, price_lamports: u64, max_purchase: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.authority = ctx.accounts.authority.key();
        state.mint = ctx.accounts.mint.key();
        state.price_lamports = price_lamports;
        state.max_purchase = max_purchase;
        state.holders_rewarded = 0;
        Ok(())
    }

    /// Compra de tokens
    pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
        let buyer = &ctx.accounts.buyer;
        let vault = &ctx.accounts.vault_token;
        let destination = &ctx.accounts.user_token;
        let state = &mut ctx.accounts.state;
        let price = state.price_lamports;

        require!(vault.amount >= amount, ErrorCode::InsufficientTokens);
        require!(amount <= state.max_purchase, ErrorCode::ExceedsMaxPurchase);

        // Calcular cantidad con bonus
        let mut total_amount = amount;
        if state.holders_rewarded < 100 {
            let bonus = amount / 10;
            total_amount += bonus;
            state.holders_rewarded += 1;
        }

        // Transferir tokens BRATE
        let transfer_ix = Transfer {
            from: vault.to_account_info(),
            to: destination.to_account_info(),
            authority: state.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), transfer_ix);
        let seeds = &[b"brate", &[ctx.accounts.state.bump]];
        token::transfer(cpi_ctx.with_signer(&[&seeds[..]]), total_amount)?;

        // Transferencia de SOL
        **ctx.accounts.buyer.to_account_info().try_borrow_mut_lamports()? -= price * amount;
        **ctx.accounts.state.to_account_info().try_borrow_mut_lamports()? += price * amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 32 + 8 + 8 + 1 + 1, seeds = [b"brate"], bump)]
    pub state: Account<'info, SaleState>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyToken<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut, has_one = mint, seeds = [b"brate"], bump = state.bump)]
    pub state: Account<'info, SaleState>,
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct SaleState {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub price_lamports: u64,
    pub max_purchase: u64,
    pub holders_rewarded: u64,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("No hay tokens suficientes en el contrato")]
    InsufficientTokens,
    #[msg("Compra excede el máximo permitido")]
    ExceedsMaxPurchase,
}
