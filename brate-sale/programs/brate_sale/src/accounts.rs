use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[account]
pub struct State {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub price_lamports: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 32 + 8)]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyToken<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub state: Account<'info, State>,

    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}
